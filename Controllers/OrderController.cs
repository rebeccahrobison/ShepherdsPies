using ShepherdsPies.Data;
using ShepherdsPies.Models;
using ShepherdsPies.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
  private ShepherdsPiesDbContext _dbContext;

  public OrderController(ShepherdsPiesDbContext context)
  {
    _dbContext = context;
  }

  [HttpGet]
  [Authorize]
  public IActionResult GetOrders()
  {
    return Ok(_dbContext
      .Orders
      .Include(o => o.Driver)
        .ThenInclude(d => d.IdentityUser)
      .Include(o => o.Employee)
        .ThenInclude(e => e.IdentityUser)
      .Include(o => o.Pizzas)
        .ThenInclude(p => p.PizzaSize)
      .Include(o => o.Pizzas)
        .ThenInclude(p => p.PizzaToppings)
      // .ThenInclude(t => t.Topping)
      .OrderByDescending(o => o.OrderDate)
      .Select(o => new OrderDTO
      {
        Id = o.Id,
        OrderDate = o.OrderDate,
        EmployeeId = o.EmployeeId,
        DriverId = o.DriverId,
        Tip = o.Tip,
        Employee = new UserProfileDTO
        {
          Id = 1,
          FirstName = o.Employee.FirstName,
          LastName = o.Employee.LastName,
          Address = o.Employee.Address,
          Email = o.Employee.IdentityUser.Email,
          UserName = o.Employee.IdentityUser.UserName
        },
        Driver = new UserProfileDTO
        {
          Id = 1,
          FirstName = o.Employee.FirstName,
          LastName = o.Employee.LastName,
          Address = o.Employee.Address,
          Email = o.Employee.IdentityUser.Email,
          UserName = o.Employee.IdentityUser.UserName
        },
        Pizzas = o.Pizzas.Select(p => new PizzaDTO
        {
          Id = p.Id,
          PizzaSizeId = p.PizzaSizeId,
          CheeseId = p.CheeseId,
          SauceId = p.SauceId,
          OrderId = p.OrderId,
          PizzaSize = new PizzaSizeDTO
          {
            Id = p.PizzaSize.Id,
            Size = p.PizzaSize.Size,
            Price = p.PizzaSize.Price
          },
          PizzaToppings = p.PizzaToppings.Select(pt => new PizzaToppingDTO
          {
            Id = pt.Id,
            PizzaId = pt.PizzaId,
            ToppingId = pt.ToppingId,
            // Topping = pt.Toppings.Select(t => new ToppingDTO
            // {
            //   Id = t.Id,
            //   Name = t.Name
            // }).ToList()
          }).ToList(),
        }).ToList()
      }).ToList());
  }

  [HttpGet("{id}")]
  [Authorize]
  public IActionResult GetOrderById(int id)
  {
    Order order = _dbContext
      .Orders
      .Include(o => o.Driver)
        .ThenInclude(d => d.IdentityUser)
      .Include(o => o.Employee)
        .ThenInclude(e => e.IdentityUser)
      .Include(o => o.Pizzas)
        .ThenInclude(p => p.PizzaSize)
      .Include(o => o.Pizzas)
        .ThenInclude(p => p.Cheese)
      .Include(o => o.Pizzas)
        .ThenInclude(p => p.Sauce)
      .Include(o => o.Pizzas)
        .ThenInclude(p => p.PizzaToppings)
          .ThenInclude(pt => pt.Topping)
      .SingleOrDefault(o => o.Id == id);

    if (order == null)
    {
      return NotFound();
    }

    return Ok(new OrderDTO
    {
      Id = order.Id,
      OrderDate = order.OrderDate,
      EmployeeId = order.EmployeeId,
      DriverId = order.DriverId,
      Tip = order.Tip,
      Employee = new UserProfileDTO
      {
        Id = 1,
        FirstName = order.Employee.FirstName,
        LastName = order.Employee.LastName,
        Address = order.Employee.Address,
        Email = order.Employee.IdentityUser.Email,
        UserName = order.Employee.IdentityUser.UserName
      },
      Driver = new UserProfileDTO
      {
        Id = 1,
        FirstName = order.Employee.FirstName,
        LastName = order.Employee.LastName,
        Address = order.Employee.Address,
        Email = order.Employee.IdentityUser.Email,
        UserName = order.Employee.IdentityUser.UserName
      },
      Pizzas = order.Pizzas.Select(p => new PizzaDTO
      {
        Id = p.Id,
        PizzaSizeId = p.PizzaSizeId,
        CheeseId = p.CheeseId,
        SauceId = p.SauceId,
        OrderId = p.OrderId,
        PizzaSize = new PizzaSizeDTO
        {
          Id = p.PizzaSize.Id,
          Size = p.PizzaSize.Size,
          Price = p.PizzaSize.Price
        },
        PizzaToppings = p.PizzaToppings.Select(pt => new PizzaToppingDTO
        {
          Id = pt.Id,
          PizzaId = pt.PizzaId,
          ToppingId = pt.ToppingId,
          Topping = new ToppingDTO
          {
            Id = pt.Topping.Id,
            Name = pt.Topping.Name
          }
        }).ToList(),
      }).ToList()
    });
  }
}























// Toppings = p.Toppings.Select(t => new ToppingDTO{
//   Id = t.Id,
//   Name = t.Name
// }).ToList()


    