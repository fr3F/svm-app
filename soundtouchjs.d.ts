declare module "soundtouchjs" {
  export class PitchShifter {
    constructor(
      context: AudioContext,
      buffer: AudioBuffer,
      bufferSize: number,
      onEnd?: () => void
    );
    pitch: number;
    pitchSemitones: number;
    tempo: number;
    rate: number;
    readonly duration: number;
    percentagePlayed: number;
    readonly timePlayed: number;
    readonly node: ScriptProcessorNode;
    connect(node: AudioNode): void;
    disconnect(): void;
  }
}
