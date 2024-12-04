export const generateJsonSuccessResponse = (message: string, data: any) => {
  return {
    message,
    data,
    status: 'success',
  }
}