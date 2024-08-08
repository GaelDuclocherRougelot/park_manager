export default class CustomApiError extends Error {
  infos: number;
  constructor(message: string, infos: number) {
    super(message);
    this.name = 'ApiError';
    this.infos = infos;
}
}