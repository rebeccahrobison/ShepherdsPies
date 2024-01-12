const _apiUrl = "/api/order";

export const getOrders = () => {
  return fetch(_apiUrl).then(res => res.json())
}