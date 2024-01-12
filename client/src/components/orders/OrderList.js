import { useEffect, useState } from "react"
import { useSubmit } from "react-router-dom"
import { getOrders } from "../../managers/orderManager"
import { Button, Table } from "reactstrap"

export const OrderList = () => {
  const [orders, setOrders] = useState([])

  const getAndSetOrders = () => {
    getOrders().then(arr => setOrders(arr))
  }

  useEffect(() => {
    getAndSetOrders()
  }, [])

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  return (
    <>
      <header>
        <h2>Orders</h2>
        <Button color="success">Create New Order</Button>
      </header>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Driver</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o =>
          (
            <tr key={o.id}>
              <td>{formatDate(o.orderDate)}</td>
              <td>{o.employee?.firstName} {o.employee?.lastName}</td>
              {o.driverId ?
                <td>{o.driver.firstName} {o.driver.lastName}</td>
                :
                <td>--</td>
              }
              <td>{o.totalCost.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</td>
            </tr>
          )
          )}
        </tbody>

      </Table>
    </>
  )
}