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
        // .ThenInclude(t => t.Toppings)
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
            // Toppings = pt.Toppings.Select(t => new ToppingDTO
            // {
            //   Id = t.Id,
            //   Name = t.Name
            // }).ToList()
          }).ToList(),
        }).ToList()
      }).ToList());
  }
}























          // Toppings = p.Toppings.Select(t => new ToppingDTO{
          //   Id = t.Id,
          //   Name = t.Name
          // }).ToList()