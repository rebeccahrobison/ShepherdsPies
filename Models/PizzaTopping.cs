namespace ShepherdsPies.Models;

public class PizzaTopping
{
  public int Id { get; set; }
  public int PizzaId { get; set; }
  public int ToppingId { get; set; }
  // public List<Pizza> Pizzas { get; set; }
  public List<Topping> Toppings { get; set; }
}