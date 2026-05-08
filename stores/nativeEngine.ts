export type MsgHandler = (msg: any) => void;

export const nativeEngine = {
  webRef: null as any,
  ready: false,
  uri: "",
  msgHandlers: new Set<MsgHandler>(),
  onReadyCallbacks: new Set<() => void>(),
};
