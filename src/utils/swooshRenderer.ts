// WebGL Swoosh Renderer with Bezier Curves and 3D Tube Shading

export interface SwooshPoint {
  x: number;
  y: number;
  controlPoint1?: { x: number; y: number };
  controlPoint2?: { x: number; y: number };
}

export interface Swoosh {
  id: string;
  points: SwooshPoint[];
  color: string;
  thickness: number;
  opacity: number;
  tubeShading: boolean;
  lightAngle: number; // Angle of light for 3D effect (0-360)
}

export const SWOOSH_VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_normal;
  attribute float a_distance; // Distance along curve for shading

  uniform vec2 u_resolution;
  uniform float u_thickness;

  varying vec2 v_normal;
  varying float v_distance;

  void main() {
    // Apply thickness based on normal
    vec2 offset = a_normal * u_thickness;
    vec2 position = a_position + offset;

    // Convert to clip space
    vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;
    clipSpace.y *= -1.0;

    gl_Position = vec4(clipSpace, 0.0, 1.0);

    v_normal = a_normal;
    v_distance = a_distance;
  }
`;

export const SWOOSH_FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec3 u_color;
  uniform float u_opacity;
  uniform bool u_tubeShading;
  uniform float u_lightAngle;

  varying vec2 v_normal;
  varying float v_distance;

  void main() {
    vec3 color = u_color;
    float alpha = u_opacity;

    if (u_tubeShading) {
      // Calculate 3D tube shading
      // v_distance represents position along the width of the tube (0 = center, ±1 = edges)

      // Create cylindrical shading effect
      float tubePos = v_distance; // -1 to 1 across tube width

      // Calculate lighting based on surface normal of cylinder
      // Simulate a cylinder wrapped around the curve
      float normalizedPos = tubePos; // Position across tube width

      // Light angle in radians
      float lightRad = radians(u_lightAngle);
      vec3 lightDir = vec3(cos(lightRad), sin(lightRad), 0.5);
      lightDir = normalize(lightDir);

      // Calculate surface normal for cylinder
      // The normal points outward from the curve center
      float angle = normalizedPos * 3.14159; // Map -1..1 to -π..π
      vec3 surfaceNormal = vec3(cos(angle), sin(angle), 0.0);

      // Calculate diffuse lighting
      float diffuse = max(dot(surfaceNormal, lightDir), 0.0);

      // Add ambient light
      float ambient = 0.3;
      float lighting = ambient + diffuse * 0.7;

      // Apply lighting to color
      color = u_color * lighting;

      // Add subtle specular highlight
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 reflectDir = reflect(-lightDir, surfaceNormal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      color += vec3(spec * 0.3);

      // Soften edges
      float edgeFalloff = 1.0 - abs(tubePos);
      edgeFalloff = smoothstep(0.0, 0.2, edgeFalloff);
      alpha *= edgeFalloff;
    } else {
      // Simple flat shading with soft edges
      float edgeFalloff = 1.0 - abs(v_distance);
      alpha *= smoothstep(0.0, 0.3, edgeFalloff);
    }

    gl_FragColor = vec4(color, alpha);
  }
`;

export class SwooshRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null;
  private program: WebGLProgram | null;
  private uniforms: { [key: string]: WebGLUniformLocation | null } = {};
  private buffers: {
    position: WebGLBuffer | null;
    normal: WebGLBuffer | null;
    distance: WebGLBuffer | null;
  } = {
    position: null,
    normal: null,
    distance: null,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });

    if (!this.gl) {
      throw new Error('WebGL not supported');
    }

    // Set clear color to transparent
    this.gl.clearColor(0, 0, 0, 0);

    // Enable blending for transparency
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.program = this.createProgram();
    this.createBuffers();
    this.getUniforms();
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;

    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private createProgram(): WebGLProgram | null {
    if (!this.gl) return null;

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, SWOOSH_VERTEX_SHADER);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, SWOOSH_FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return null;

    const program = this.gl.createProgram();
    if (!program) return null;

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(program));
      return null;
    }

    this.gl.useProgram(program);
    return program;
  }

  private createBuffers(): void {
    if (!this.gl) return;

    this.buffers.position = this.gl.createBuffer();
    this.buffers.normal = this.gl.createBuffer();
    this.buffers.distance = this.gl.createBuffer();
  }

  private getUniforms(): void {
    if (!this.gl || !this.program) return;

    const uniformNames = [
      'u_resolution',
      'u_thickness',
      'u_color',
      'u_opacity',
      'u_tubeShading',
      'u_lightAngle',
    ];

    uniformNames.forEach((name) => {
      this.uniforms[name] = this.gl!.getUniformLocation(this.program!, name);
    });
  }

  // Evaluate cubic Bezier curve at parameter t (0-1)
  private evaluateBezier(
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    t: number
  ): { x: number; y: number } {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    return {
      x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
      y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
    };
  }

  // Calculate tangent at parameter t
  private evaluateBezierTangent(
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    t: number
  ): { x: number; y: number } {
    const u = 1 - t;
    const uu = u * u;
    const tt = t * t;

    const dx =
      -3 * uu * p0.x +
      3 * uu * p1.x -
      6 * u * t * p1.x +
      6 * u * t * p2.x -
      3 * tt * p2.x +
      3 * tt * p3.x;

    const dy =
      -3 * uu * p0.y +
      3 * uu * p1.y -
      6 * u * t * p1.y +
      6 * u * t * p2.y -
      3 * tt * p2.y +
      3 * tt * p3.y;

    const length = Math.sqrt(dx * dx + dy * dy);
    return {
      x: dx / length,
      y: dy / length,
    };
  }

  // Generate mesh for swoosh curve
  private generateSwooshMesh(swoosh: Swoosh): {
    positions: Float32Array;
    normals: Float32Array;
    distances: Float32Array;
    vertexCount: number;
  } {
    const segments = 50; // Segments per curve
    const positions: number[] = [];
    const normals: number[] = [];
    const distances: number[] = [];

    // Process each curve segment between points
    for (let i = 0; i < swoosh.points.length - 1; i++) {
      const p0 = swoosh.points[i];
      const p3 = swoosh.points[i + 1];

      // Use control points or default to straight line
      const p1 = p0.controlPoint2 || { x: p0.x + (p3.x - p0.x) / 3, y: p0.y + (p3.y - p0.y) / 3 };
      const p2 = p3.controlPoint1 || { x: p0.x + (2 * (p3.x - p0.x)) / 3, y: p0.y + (2 * (p3.y - p0.y)) / 3 };

      // Generate points along the Bezier curve
      for (let j = 0; j < segments; j++) {
        const t1 = j / segments;
        const t2 = (j + 1) / segments;

        const pos1 = this.evaluateBezier(p0, p1, p2, p3, t1);
        const pos2 = this.evaluateBezier(p0, p1, p2, p3, t2);

        const tan1 = this.evaluateBezierTangent(p0, p1, p2, p3, t1);
        const tan2 = this.evaluateBezierTangent(p0, p1, p2, p3, t2);

        // Calculate normals (perpendicular to tangent)
        const normal1 = { x: -tan1.y, y: tan1.x };
        const normal2 = { x: -tan2.y, y: tan2.x };

        // Create quad (two triangles)
        // Triangle 1
        positions.push(pos1.x, pos1.y); // Center
        normals.push(normal1.x, normal1.y);
        distances.push(-1.0);

        positions.push(pos1.x, pos1.y); // Edge
        normals.push(normal1.x, normal1.y);
        distances.push(1.0);

        positions.push(pos2.x, pos2.y);
        normals.push(normal2.x, normal2.y);
        distances.push(-1.0);

        // Triangle 2
        positions.push(pos2.x, pos2.y);
        normals.push(normal2.x, normal2.y);
        distances.push(-1.0);

        positions.push(pos1.x, pos1.y);
        normals.push(normal1.x, normal1.y);
        distances.push(1.0);

        positions.push(pos2.x, pos2.y);
        normals.push(normal2.x, normal2.y);
        distances.push(1.0);
      }
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      distances: new Float32Array(distances),
      vertexCount: positions.length / 2,
    };
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
        ]
      : [1, 1, 1];
  }

  public renderSwoosh(swoosh: Swoosh): void {
    if (!this.gl || !this.program) return;

    // Set viewport
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Generate mesh
    const mesh = this.generateSwooshMesh(swoosh);

    // Bind position buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.positions, this.gl.DYNAMIC_DRAW);
    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Bind normal buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normal);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.normals, this.gl.DYNAMIC_DRAW);
    const normalLocation = this.gl.getAttribLocation(this.program, 'a_normal');
    this.gl.enableVertexAttribArray(normalLocation);
    this.gl.vertexAttribPointer(normalLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Bind distance buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.distance);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.distances, this.gl.DYNAMIC_DRAW);
    const distanceLocation = this.gl.getAttribLocation(this.program, 'a_distance');
    this.gl.enableVertexAttribArray(distanceLocation);
    this.gl.vertexAttribPointer(distanceLocation, 1, this.gl.FLOAT, false, 0, 0);

    // Set uniforms
    this.gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.uniforms.u_thickness, swoosh.thickness);

    const color = this.hexToRgb(swoosh.color);
    this.gl.uniform3f(this.uniforms.u_color, color[0], color[1], color[2]);
    this.gl.uniform1f(this.uniforms.u_opacity, swoosh.opacity);
    this.gl.uniform1i(this.uniforms.u_tubeShading, swoosh.tubeShading ? 1 : 0);
    this.gl.uniform1f(this.uniforms.u_lightAngle, swoosh.lightAngle);

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.vertexCount);
  }

  public clear(): void {
    if (!this.gl) return;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  public destroy(): void {
    if (this.gl) {
      if (this.program) this.gl.deleteProgram(this.program);
      if (this.buffers.position) this.gl.deleteBuffer(this.buffers.position);
      if (this.buffers.normal) this.gl.deleteBuffer(this.buffers.normal);
      if (this.buffers.distance) this.gl.deleteBuffer(this.buffers.distance);
    }
  }
}
