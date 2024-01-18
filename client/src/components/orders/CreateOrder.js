import { Button, FormGroup } from "reactstrap"
import { OrderForm } from "./OrderForm"
import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { getCheeses, getPizzaSizes, getSauces, getToppings } from "../../managers/pizzaManager"
import "../orders/Order.css"
import { getUserProfiles } from "../../managers/userProfileManager"
import { createOrder } from "../../managers/orderManager"
import { useNavigate } from "react-router-dom"


export const CreateOrder = ({ loggedInUser }) => {
  const [newOrder, setNewOrder] = useState({
    employeeId: loggedInUser.id,
    driverId: null,
    tip: null,
    pizzas: []
  })
  const [sizes, setSizes] = useState([])
  const [cheeses, setCheeses] = useState([])
  const [sauces, setSauces] = useState([])
  const [toppings, setToppings] = useState([])
  const [drivers, setDrivers] = useState([])
  const [isDelivery, setIsDelivery] = useState(false)
  const [tip, setTip] = useState(0)
  const [pizzas, setPizzas] = useState([
    {
      pizzaSizeId: null,
      cheeseId: null,
      sauceId: null,
      pizzaToppings: []
    }
  ])

  useEffect(() => {
    getPizzaSizes().then(arr => setSizes(arr))
    getCheeses().then(arr => setCheeses(arr))
    getSauces().then(arr => setSauces(arr))
    getToppings().then(arr => setToppings(arr))
    getUserProfiles().then(arr => setDrivers(arr))
  }, [])

  const handleAddPizzaBtn = (e) => {
    setPizzas((prevPizzas) => [
      ...prevPizzas,
      {
      pizzaSizeId: null,
      cheeseId: null,
      sauceId: null,
      pizzaToppings: [{toppingId: null}]
      }
    ])
  }

  const navigate = useNavigate()

  const handleRemovePizzaBtn = (index) => {
    setPizzas((prevPizzas) => prevPizzas.filter((_, i) => i !== index))
  }

  const handlePizzaChange = (index, property, value) => {
    setPizzas((prevPizzas) => {
      const updatedPizzas = [...prevPizzas]
      updatedPizzas[index][property] = parseInt(value)
      return updatedPizzas
    })
  }

  const handleToppingChange = (index, toppingId, isChecked) => {
    setPizzas((prevPizzas) => {
      const updatedPizzas = [...prevPizzas]
      const selectedToppings = updatedPizzas[index].pizzaToppings

      if (isChecked) {
        selectedToppings.push({ toppingId: toppingId})
      } else {
        const indexToRemove = selectedToppings.findIndex(topping => topping.toppingId === toppingId)
        if (indexToRemove !== -1) {
          selectedToppings.splice(indexToRemove, 1)
        }
      }

      return updatedPizzas
    })
  }

  const handleDeliveryCheckbox = () => {
    setNewOrder((prevOrder) => {
      return {
        ...prevOrder,
        driverId: isDelivery ? null : prevOrder.driverId,
      };
    });
    setIsDelivery(!isDelivery)
  }

  const handleSubmitOrderBtn = (e) => {
    e.preventDefault()

    const orderToSubmit = {
      employeeId: loggedInUser.id,
      driverId: newOrder.driverId,
      tip: parseFloat(tip),
      pizzas: pizzas
    }

    console.log(orderToSubmit)
    createOrder(orderToSubmit).then(() => navigate("/"))
  }

  return (
    <>
      <div className="header-container">
        <h2>Create New Order</h2>
        <div>
          {isDelivery && (
            <select onChange={e => newOrder.driverId = parseInt(e.target.value)}>
              <option>Select a driver</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>{driver?.firstName} {driver?.lastName}</option>
              ))}
            </select>

          )}
          <label>
            <input 
              type="checkbox"
              checked={isDelivery}
              onChange={handleDeliveryCheckbox}
            />
            Delivery
          </label>
        </div>
      </div>

      {/* <OrderForm newOrder={newOrder} setNewOrder={setNewOrder}/> */}
      {pizzas.map((pizza, index) => (
        <div key={index} className="form-container">
          <Form>
            <FormGroup>
              <h6>Size</h6>
              <select onChange={e => handlePizzaChange(index, 'pizzaSizeId', e.target.value)}>
                <option value='0'>Choose size</option>
                {sizes.map(size => (
                  <option key={size.id} value={size.id}>{size?.size}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <h6>Cheese</h6>
              <select onChange={e => handlePizzaChange(index, 'cheeseId', e.target.value)}>
                <option value='0'>Choose a cheese</option>
                {cheeses.map(cheese => (
                  <option key={cheese.id} value={cheese.id}>{cheese?.name}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <h6>Sauce</h6>
              <select onChange={e => handlePizzaChange(index, 'sauceId', e.target.value)}>
                <option value='0'>Choose a sauce</option>
                {sauces.map(sauce => (
                  <option key={sauce.id} value={sauce.id}>{sauce?.name}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <h6>Toppings</h6>
              <div className="toppings-container">
                {toppings.map(topping => (
                  <label key={topping.id}>
                    <input 
                      type="checkbox"
                      checked={pizza.pizzaToppings.some((toppingObj) => toppingObj.toppingId === topping.id)}
                      onChange={e => handleToppingChange(index, topping.id, e.target.checked)}
                    />
                    {topping?.name}
                  </label>
                ))}
              </div>
            </FormGroup>

            <Button className="remove-btn" color="danger" onClick={() => handleRemovePizzaBtn(index)}>
              Remove
            </Button>

          </Form>
        </div>
      ))}
      <Button color="danger" onClick={handleAddPizzaBtn}>
        +Add another pizza
      </Button>
      <div className="tip-container">
        Tip Amount:
        <input type="number" step="0.01" onChange={e => setTip(e.target.value)}/>
      </div>
      <div className="submit-btn-container">
        <Button type="submit" color="success" onClick={e => handleSubmitOrderBtn(e)}>Submit Order</Button>
      </div>
    </>
  )
}