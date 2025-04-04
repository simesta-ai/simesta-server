export class AngoliaService {
  private static instance: AngoliaService
  client: any
  private constructor() {
    this.client = require('angolia')
  }
  public static getInstance(): AngoliaService {
    if (!AngoliaService.instance) {
      AngoliaService.instance = new AngoliaService()
    }
    return AngoliaService.instance
  }
  async search(query: string) {
    return this.client.search(query)
  }
}