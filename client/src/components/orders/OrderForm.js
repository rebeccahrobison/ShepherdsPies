import { useEffect, useState } from "react"
import { getCheeses, getPizzaSizes, getSauces, getToppings } from "../../managers/pizzaManager"
import { Button, Form, FormGroup } from "reactstrap"
import { getUserProfiles } from "../../managers/userProfileManager"

export const OrderForm = ({ 
  pizzas, 
  handlePizzaChange, 
  order,
  setOrder,
  setPizzas
}) => {
  
  const [sizes, setSizes] = useState([])
  const [cheeses, setCheeses] = useState([])
  const [sauces, setSauces] = useState([])
  const [toppings, setToppings] = useState([])
  const [isDelivery, setIsDelivery] = useState(false)
  const [drivers, setDrivers] = useState([])
  
  useEffect(() => {
    getCheeses().then(arr => setCheeses(arr))
    getSauces().then(arr => setSauces(arr))
    getToppings().then(arr => setToppings(arr))
    getPizzaSizes().then(arr => setSizes(arr))
    getUserProfiles().then(arr => setDrivers(arr))
  }, [])

  useEffect(() => {
    setIsDelivery(!!order.driverId)
    if (isDelivery) {
      setIsDelivery(true)
    }
  }, [order, isDelivery])

  const handleDeliveryCheckbox = () => {
    setOrder((prevOrder) => {
      return {
        ...prevOrder,
        driverId: isDelivery ? null : prevOrder.driverId,
      };
    });
    setIsDelivery(!isDelivery)
  }
  const handleTipChange = (e) => {
    const tipValue = parseInt(e.target.value)
    setOrder((prevOrder) => ({ ...prevOrder, tip: tipValue }))
  }

  const handleRemovePizzaBtn = (index) => {
    setPizzas((prevPizzas) => prevPizzas.filter((_, i) => i !== index))
  }

  const handleToppingChange = (index, toppingId, isChecked) => {
    setPizzas((prevPizzas) => {
      const updatedPizzas = [...prevPizzas]
      const selectedToppings = updatedPizzas[index].pizzaToppings

      if (isChecked) {
        selectedToppings.push({ toppingId: toppingId, pizzaId: updatedPizzas[index].id })
      } else {
        const indexToRemove = selectedToppings.findIndex(topping => topping.toppingId === toppingId)
        if (indexToRemove !== -1) {
          selectedToppings.splice(indexToRemove, 1)
        }
      }

      updatedPizzas[index] = {
        ...updatedPizzas[index],
        pizzaToppings: [...selectedToppings]
      }

      return updatedPizzas
    })
  }

  const handleAddPizzaBtn = (e) => {
    setPizzas((prevPizzas) => [
      ...prevPizzas,
      {
        pizzaSizeId: null,
        cheeseId: null,
        sauceId: null,
        pizzaToppings: []
      }
    ])
  }



  return (
    <>
      <div className="delivery-container">
        {isDelivery && (
          <select onChange={e => setOrder(prevOrder => ({...prevOrder, driverId: parseInt(e.target.value)}))} value={order.driverId || ""}>
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

      {pizzas.map((pizza, index) => (
        <div key={index} className="form-container">
          <Form>
            <FormGroup>
              <h6>Size</h6>
              <select onChange={e => handlePizzaChange(index, 'pizzaSizeId', e.target.value)} value={pizza.pizzaSizeId}>
                <option value='0'>Choose size</option>
                {sizes.map(size => (
                  <option key={size.id} value={size.id}>{size?.size}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <h6>Cheese</h6>
              <select onChange={e => handlePizzaChange(index, 'cheeseId', e.target.value)} value={pizza.cheeseId}>
                <option value='0'>Choose a cheese</option>
                {cheeses.map(cheese => (
                  <option key={cheese.id} value={cheese.id}>{cheese?.name}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup>
              <h6>Sauce</h6>
              <select onChange={e => handlePizzaChange(index, 'sauceId', e.target.value)} value={pizza.sauceId}>
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
        <input type="number" step="0.01" onChange={handleTipChange} value={order.tip || ""}/>
      </div>
    
    </>
  )
}

// order object {id, orderDate, employeeId, driverId?, pizzas, tip?}
// pizza object {id, pizzaSizeId, cheeseId, sauceId, orderId, toppings}