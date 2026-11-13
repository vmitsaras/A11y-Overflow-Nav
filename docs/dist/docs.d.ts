//#region src/docs.d.ts
interface PluginDocs {
  slug: string;
  name: string;
  packageName: string;
  description: string;
  repo?: string;
  install: {
    npm: string;
    pnpm: string;
    yarn: string;
  };
  usage: string;
  selectors?: string[];
  keyboard?: Array<{
    key: string;
    description: string;
  }>;
  api: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  examples?: Array<{
    name: string;
    description: string;
    path: string;
  }>;
  options?: Array<{
    name: string;
    type: string;
    default: string;
    attribute?: string;
    description: string;
  }>;
  attributes?: Array<{
    name: string;
    authored: boolean;
    description: string;
  }>;
  events?: Array<{
    name: string;
    timing: string;
    reasons: string[];
    bubbles: boolean;
    composed: boolean;
    cancelable: boolean;
    detail: string;
  }>;
  lifecycle?: Array<{
    stage: string;
    description: string;
  }>;
  accessibility?: Array<{
    topic: string;
    description: string;
  }>;
  limitations?: string[];
}
declare const docs: {
  slug: string;
  name: string;
  packageName: string;
  description: string;
  repo: string;
  install: {
    npm: string;
    pnpm: string;
    yarn: string;
  };
  usage: string;
  selectors: string[];
  options: ({
    name: string;
    type: string;
    default: string;
    attribute: string;
    description: string;
  } | {
    name: string;
    type: string;
    default: string;
    description: string;
    attribute?: undefined;
  })[];
  attributes: {
    name: string;
    authored: false;
    description: string;
  }[];
  keyboard: {
    key: string;
    description: string;
  }[];
  api: {
    name: string;
    type: string;
    description: string;
  }[];
  events: {
    name: string;
    timing: string;
    reasons: string[];
    bubbles: true;
    composed: false;
    cancelable: false;
    detail: string;
  }[];
  lifecycle: {
    stage: string;
    description: string;
  }[];
  accessibility: {
    topic: string;
    description: string;
  }[];
  examples: {
    name: string;
    description: string;
    path: string;
  }[];
  limitations: string[];
};
//#endregion
export { PluginDocs, docs };
//# sourceMappingURL=docs.d.ts.map