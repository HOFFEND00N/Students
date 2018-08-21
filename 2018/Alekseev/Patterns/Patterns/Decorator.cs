using System;

namespace Patterns
{
    public class Decorator
    {
        public void RunExample()
        {
            Pizza italianPizzaWithTomatoes = new ItalianPizza();
            Console.WriteLine($"Name : {italianPizzaWithTomatoes.Name}");
            Console.WriteLine($"Cost : {italianPizzaWithTomatoes.GetCost()}");
            Console.WriteLine("--------------------------------------------------");
            italianPizzaWithTomatoes = new TomatoPizza(italianPizzaWithTomatoes); // adding tomatoes to italian pizza
            Console.WriteLine($"Name : {italianPizzaWithTomatoes.Name}");
            Console.WriteLine($"Cost : {italianPizzaWithTomatoes.GetCost()}");
            Console.WriteLine();

            Pizza italianPizzaWithCheese = new ItalianPizza();
            Console.WriteLine($"Name : {italianPizzaWithCheese.Name}");
            Console.WriteLine($"Cost : {italianPizzaWithCheese.GetCost()}");
            Console.WriteLine("--------------------------------------------------");
            italianPizzaWithCheese = new CheesePizza(italianPizzaWithCheese);
            Console.WriteLine($"Name : {italianPizzaWithCheese.Name}");
            Console.WriteLine($"Cost : {italianPizzaWithCheese.GetCost()}");
            Console.WriteLine();

            Pizza bulgarianPizza = new BulgerianPizza();
            Console.WriteLine($"Name : {bulgarianPizza.Name}");
            Console.WriteLine($"Cost : {bulgarianPizza.GetCost()}");
            Console.WriteLine("--------------------------------------------------");
            bulgarianPizza = new TomatoPizza(bulgarianPizza);
            Console.WriteLine($"Name : {bulgarianPizza.Name}");
            Console.WriteLine($"Cost : {bulgarianPizza.GetCost()}");
            Console.WriteLine("--------------------------------------------------");
            bulgarianPizza = new CheesePizza(bulgarianPizza);
            Console.WriteLine($"Name : {bulgarianPizza.Name}");
            Console.WriteLine($"Cost : {bulgarianPizza.GetCost()}");
            Console.WriteLine();
        }

        abstract class Pizza
        {
            public Pizza(string name)
            {
                Name = name;
            }

            public string Name { get; protected set; }
            public abstract int GetCost();
        }

        class ItalianPizza : Pizza
        {
            public ItalianPizza() : base("Italian pizza") { }

            public override int GetCost()
            {
                return 10;
            }
        }

        class BulgerianPizza : Pizza
        {
            public BulgerianPizza() : base("Bulgerian pizza") { }

            public override int GetCost()
            {
                return 8;
            }
        }

        abstract class PizzaDecorator : Pizza
        {
            protected Pizza _Pizza;

            public PizzaDecorator(string name, Pizza pizza) : base(name)
            {
                _Pizza = pizza;
            }
        }

        class TomatoPizza : PizzaDecorator
        {
            public TomatoPizza(Pizza pizza) : base(pizza.Name + " with tomatoes", pizza) { }

            public override int GetCost()
            {
                return _Pizza.GetCost() + 3;
            }
        }

        class CheesePizza : PizzaDecorator
        {
            public CheesePizza(Pizza pizza) : base(pizza.Name + " with cheese",pizza) { }

            public override int GetCost()
            {
                return _Pizza.GetCost() + 5;
            }
        }
    }
}
