// WebGL Shader-based Noise Generator
// Much faster than CPU-based noise generation

export const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 v_uv;

  uniform vec2 u_resolution;
  uniform vec3 u_colorA;
  uniform vec3 u_colorB;
  uniform float u_scale;
  uniform int u_octaves;
  uniform float u_lacunarity;
  uniform float u_gain;
  uniform float u_contrast;
  uniform float u_seed;
  uniform float u_time;
  uniform sampler2D u_backgroundImage;
  uniform bool u_hasBackground;
  uniform int u_blendMode;
  uniform float u_grainIntensity;

  // Hash function for seeded randomness
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21) + u_seed);
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Improved Perlin noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Four corners
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Bilinear interpolation
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 2.0 - 1.0;
  }

  // Fractional Brownian Motion (fBm)
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float maxValue = 0.0;

    for (int i = 0; i < 8; i++) {
      if (i >= u_octaves) break;

      value += amplitude * noise(p * frequency);
      maxValue += amplitude;
      amplitude *= u_gain;
      frequency *= u_lacunarity;
    }

    return value / maxValue;
  }

  // Blend mode implementations
  vec3 blendMultiply(vec3 base, vec3 blend) {
    return base * blend;
  }

  vec3 blendScreen(vec3 base, vec3 blend) {
    return vec3(1.0) - (vec3(1.0) - base) * (vec3(1.0) - blend);
  }

  vec3 blendOverlay(vec3 base, vec3 blend) {
    return mix(
      2.0 * base * blend,
      vec3(1.0) - 2.0 * (vec3(1.0) - base) * (vec3(1.0) - blend),
      step(0.5, base)
    );
  }

  vec3 blendHardLight(vec3 base, vec3 blend) {
    return blendOverlay(blend, base);
  }

  vec3 blendSoftLight(vec3 base, vec3 blend) {
    return mix(
      2.0 * base * blend + base * base * (vec3(1.0) - 2.0 * blend),
      sqrt(base) * (2.0 * blend - vec3(1.0)) + 2.0 * base * (vec3(1.0) - blend),
      step(0.5, blend)
    );
  }

  vec3 blendColorDodge(vec3 base, vec3 blend) {
    return min(vec3(1.0), base / (vec3(1.0) - blend + 0.001));
  }

  vec3 blendColorBurn(vec3 base, vec3 blend) {
    return vec3(1.0) - min(vec3(1.0), (vec3(1.0) - base) / (blend + 0.001));
  }

  vec3 blendDarken(vec3 base, vec3 blend) {
    return min(base, blend);
  }

  vec3 blendLighten(vec3 base, vec3 blend) {
    return max(base, blend);
  }

  vec3 blendDifference(vec3 base, vec3 blend) {
    return abs(base - blend);
  }

  vec3 blendExclusion(vec3 base, vec3 blend) {
    return base + blend - 2.0 * base * blend;
  }

  vec3 blendDivide(vec3 base, vec3 blend) {
    return min(vec3(1.0), base / (blend + 0.001));
  }

  vec3 applyBlendMode(vec3 base, vec3 blend, int mode) {
    if (mode == 1) return blendMultiply(base, blend);        // multiply
    if (mode == 2) return blendScreen(base, blend);          // screen
    if (mode == 3) return blendOverlay(base, blend);         // overlay
    if (mode == 4) return blendHardLight(base, blend);       // hard-light
    if (mode == 5) return blendSoftLight(base, blend);       // soft-light
    if (mode == 6) return blendColorDodge(base, blend);      // color-dodge
    if (mode == 7) return blendColorBurn(base, blend);       // color-burn
    if (mode == 8) return blendDarken(base, blend);          // darken
    if (mode == 9) return blendLighten(base, blend);         // lighten
    if (mode == 10) return blendDifference(base, blend);     // difference
    if (mode == 11) return blendExclusion(base, blend);      // exclusion
    if (mode == 12) return blendDivide(base, blend);         // divide
    return blend; // normal (mode == 0)
  }

  // High-frequency grain noise
  float grain(vec2 uv) {
    // Use high-frequency noise for fine grain
    vec2 scaledUV = uv * u_resolution * 0.5;

    // Simple random noise based on UV coordinates
    float random = fract(sin(dot(scaledUV, vec2(12.9898, 78.233))) * 43758.5453);

    // Add some variation with hash
    float grain = hash(scaledUV);

    // Mix random and hash for better grain quality
    return mix(random, grain, 0.5);
  }

  void main() {
    // Calculate noise coordinates
    vec2 uv = v_uv;
    vec2 noiseCoord = uv * u_scale + u_time;

    // Generate noise value
    float noiseValue = fbm(noiseCoord);

    // Normalize to 0-1
    noiseValue = noiseValue * 0.5 + 0.5;

    // Apply contrast curve
    if (noiseValue < 0.5) {
      noiseValue = pow(noiseValue * 2.0, u_contrast) * 0.5;
    } else {
      noiseValue = 1.0 - pow((1.0 - noiseValue) * 2.0, u_contrast) * 0.5;
    }

    // Blend between colors to create duotone
    vec3 noiseColor = mix(u_colorA, u_colorB, noiseValue);

    // Get background color if available
    vec3 finalColor = noiseColor;
    if (u_hasBackground) {
      vec3 backgroundColor = texture2D(u_backgroundImage, uv).rgb;
      finalColor = applyBlendMode(backgroundColor, noiseColor, u_blendMode);
    }

    // Add grain texture for smoother/softer feel
    float grainValue = grain(uv);
    // Center grain around 0.5 and scale by intensity
    grainValue = (grainValue - 0.5) * u_grainIntensity;
    // Apply grain overlay
    finalColor = clamp(finalColor + vec3(grainValue), 0.0, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export interface ShaderNoiseConfig {
  width: number;
  height: number;
  colorA: string;
  colorB: string;
  scale: number;
  octaves: number;
  lacunarity: number;
  gain: number;
  contrast: number;
  seed: number;
  grainIntensity?: number;
  time?: number;
  backgroundImage?: HTMLImageElement;
  blendMode?: string;
}

export class WebGLNoiseRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null;
  private program: WebGLProgram | null;
  private uniforms: { [key: string]: WebGLUniformLocation | null } = {};
  private animationFrameId: number | null = null;
  private isPaused: boolean = true;
  private currentTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true,
      antialias: true,
    });

    if (!this.gl) {
      throw new Error('WebGL not supported');
    }

    this.program = this.createProgram();
    this.setupGeometry();
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

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

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

  private setupGeometry(): void {
    if (!this.gl || !this.program) return;

    // Full-screen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  private getUniforms(): void {
    if (!this.gl || !this.program) return;

    const uniformNames = [
      'u_resolution',
      'u_colorA',
      'u_colorB',
      'u_scale',
      'u_octaves',
      'u_lacunarity',
      'u_gain',
      'u_contrast',
      'u_seed',
      'u_time',
      'u_backgroundImage',
      'u_hasBackground',
      'u_blendMode',
      'u_grainIntensity',
    ];

    uniformNames.forEach(name => {
      this.uniforms[name] = this.gl!.getUniformLocation(this.program!, name);
    });
  }

  private blendModeToInt(mode?: string): number {
    const modeMap: { [key: string]: number } = {
      'normal': 0,
      'multiply': 1,
      'screen': 2,
      'overlay': 3,
      'hard-light': 4,
      'soft-light': 5,
      'color-dodge': 6,
      'color-burn': 7,
      'darken': 8,
      'lighten': 9,
      'difference': 10,
      'exclusion': 11,
      'divide': 12,
    };
    return modeMap[mode || 'normal'] || 0;
  }

  private loadTexture(image: HTMLImageElement): WebGLTexture | null {
    if (!this.gl) return null;

    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Upload image
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    );

    // Set texture parameters
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    return texture;
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
        ]
      : [0, 0, 0];
  }

  public render(config: ShaderNoiseConfig): void {
    if (!this.gl) return;

    // Set canvas size
    this.canvas.width = config.width;
    this.canvas.height = config.height;
    this.gl.viewport(0, 0, config.width, config.height);

    // Set uniforms
    this.gl.uniform2f(this.uniforms.u_resolution, config.width, config.height);

    const colorA = this.hexToRgb(config.colorA);
    const colorB = this.hexToRgb(config.colorB);
    this.gl.uniform3f(this.uniforms.u_colorA, colorA[0], colorA[1], colorA[2]);
    this.gl.uniform3f(this.uniforms.u_colorB, colorB[0], colorB[1], colorB[2]);

    this.gl.uniform1f(this.uniforms.u_scale, config.scale);
    this.gl.uniform1i(this.uniforms.u_octaves, config.octaves);
    this.gl.uniform1f(this.uniforms.u_lacunarity, config.lacunarity);
    this.gl.uniform1f(this.uniforms.u_gain, config.gain);
    this.gl.uniform1f(this.uniforms.u_contrast, config.contrast);
    this.gl.uniform1f(this.uniforms.u_seed, config.seed);
    this.gl.uniform1f(this.uniforms.u_time, config.time || this.currentTime);
    this.gl.uniform1f(this.uniforms.u_grainIntensity, config.grainIntensity || 0.15);

    // Handle background image
    if (config.backgroundImage) {
      const texture = this.loadTexture(config.backgroundImage);
      if (texture) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(this.uniforms.u_backgroundImage, 0);
        this.gl.uniform1i(this.uniforms.u_hasBackground, 1);
        this.gl.uniform1i(this.uniforms.u_blendMode, this.blendModeToInt(config.blendMode));
      }
    } else {
      this.gl.uniform1i(this.uniforms.u_hasBackground, 0);
    }

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  public play(): void {
    this.isPaused = false;
    this.animate();
  }

  public pause(): void {
    this.isPaused = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private animate = (): void => {
    if (this.isPaused) return;

    this.currentTime += 0.01; // Adjust speed as needed
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  public setTime(time: number): void {
    this.currentTime = time;
  }

  public destroy(): void {
    this.pause();
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}
