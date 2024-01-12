namespace ShepherdsPies.Models.DTOs;

public class PizzaToppingDTO
{
  public int Id { get; set; }
  public int PizzaId { get; set; }
  public int ToppingId { get; set; }
  // public List<PizzaDTO> Pizzas { get; set; }
  public List<ToppingDTO> Toppings { get; set; }
}