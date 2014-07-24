﻿
namespace RefactoringDemo.Steps.Step1
{
    public abstract class Price
    {
        public abstract double GetCharge(int daysRented);

        public int GetProfit(int daysRented)
        {
            return 1;
        }
    }

    public class ChildrensPrice : Price
    {
       public override double GetCharge(int daysRented)
        {
            double result = 0;
            result += 2;
            if (daysRented > 2)
                result += (daysRented - 2)*1.5;
            return result;
        }
    }

    public class RegularPrice : Price
    {
        public override double GetCharge(int daysRented)
        {
            double result = 0;
            result += daysRented * 3;
            return result;
        }
    }

    public class NewReleasePrice : Price
    {
        public override double GetCharge(int daysRented)
        {
            double result = 0;
            result += 1.5;
            if (daysRented > 3)
                result += (daysRented - 3) * 1.5;
            return result;
        }
        public new int GetProfit(int daysRented)
        {
            return (daysRented > 1) ? 2: 1;
        }
    }
}
