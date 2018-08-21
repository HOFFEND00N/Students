using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Patterns
{
    public class Factory
    {
        public void RunExample()
        {
            Builder builder = new PanelBuilder("ZAO PanelMachoMan");
            Building building = builder.Build();

            builder = new WoodBuilder("PAO StickyMacho");
            building = builder.Build();

            Console.ReadLine();
        }

        public abstract class Building { }

        public class PanelBuilding : Building
        {
            public PanelBuilding()
            {
                Console.WriteLine("Created panel building");
            }
        }

        public class WoodBuilding : Building
        {
            public WoodBuilding()
            {
                Console.WriteLine("Created wooden building");
            }
        }

        abstract class Builder
        {
            public string Name { get; set; }

            public Builder(string name)
            {
                Name = name;
            }

            public abstract Building Build();
        }

        class PanelBuilder : Builder
        {
            public PanelBuilder(string name) : base(name) { }
            public override Building Build()
            {
                return new PanelBuilding();
            }
        }

        class WoodBuilder : Builder
        {
            public WoodBuilder(string name) : base(name) { }

            public override Building Build()
            {
                return new WoodBuilding();
            }
        }
    }
}
