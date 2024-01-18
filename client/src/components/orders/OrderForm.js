import { useEffect, useState } from "react"
import { getCheeses, getPizzaSizes, getSauces, getToppings } from "../../managers/pizzaManager"

export const OrderForm = ({ newOrder, setNewOrder }) => {
  const [sizes, setSizes] = useState([])
  const [cheeses, setCheeses] = useState([])
  const [sauces, setSauces] = useState([])
  const [toppings, setToppings] = useState([])
  
  useEffect(() => {
    getCheeses().then(arr => setCheeses(arr))
    getSauces().then(arr => setSauces(arr))
    getToppings().then(arr => setToppings(arr))
    getPizzaSizes().then(arr => setSizes(arr))
  }, [])

  //TODO create "Add a Pizza" button that adds a line of the form
  //TODO create more user logins so there's a list to render
  return (
    <>
    
    
    </>
  )
}

// order object {id, orderDate, employeeId, driverId?, pizzas, tip?}
// pizza object {id, pizzaSizeId, cheeseId, sauceId, orderId, toppings}