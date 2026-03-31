import apiConfig from "../constants/apiConfig";

export default async function request(
  url: string,
  opts: RequestInit = {} as RequestInit
) {
  const response = await fetch(apiConfig.createUrl(url), opts);
  if (response.status === 401) {
    const resfreshResponse = await fetch(
      apiConfig.createUrl("session/refresh"),
      { credentials: "include" }
    );
    if (!resfreshResponse.ok) throw { status: 401 };
    return await fetch(apiConfig.createUrl(url), opts);
  } else return response;
}
