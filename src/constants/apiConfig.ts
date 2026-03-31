const apiConfig = {
  url: "http://localhost:3000/api",
  version: "v1",
  createUrl: (path: string) => {
    return `${apiConfig.url}/${apiConfig.version}/${path}`;
  },
} as const;
export default apiConfig;
