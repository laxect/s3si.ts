export type LoginState = {
  sessionToken?: string;
  gToken?: string;
  bulletToken?: string;
};
export type RankState = {
  // generated by gameId(battle.id)
  // If the gameId does not exist, the tracker will assume that the user has
  // not played a bankara match. And it will start tracking from the first match
  gameId?: string;
  // C-, B, A+, S, S+0, S+12
  rank: string;
  rankPoint: number;
};
export type State = {
  loginState?: LoginState;
  fGen: string;
  appUserAgent?: string;
  userLang?: string;
  userCountry?: string;

  rankState?: RankState;

  cacheDir: string;

  // Exporter config
  statInkApiKey?: string;
  fileExportPath: string;
  monitorInterval: number;
};

export const DEFAULT_STATE: State = {
  cacheDir: "./cache",
  fGen: "https://api.imink.app/f",
  fileExportPath: "./export",
  monitorInterval: 500,
};

export type StateBackend = {
  read: () => Promise<State>;
  write: (newState: State) => Promise<void>;
};

export class FileStateBackend implements StateBackend {
  constructor(private path: string) {}

  async read(): Promise<State> {
    const data = await Deno.readTextFile(this.path);
    const json = JSON.parse(data);
    return json;
  }

  async write(newState: State): Promise<void> {
    const data = JSON.stringify(newState, undefined, 2);
    const swapPath = `${this.path}.swap`;
    await Deno.writeTextFile(swapPath, data);
    await Deno.rename(swapPath, this.path);
  }
}
