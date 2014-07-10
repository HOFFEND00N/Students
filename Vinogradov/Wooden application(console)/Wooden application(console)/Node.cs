﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wooden_application_console_
{
    public class Node<T>
    {
        public T Value { set; get; }
        public Node<T> LeftNode { set; get; }
        public Node<T> RightNode { set; get; }
        public Node(T value)
        {
            Value = value;
            LeftNode = null;
            RightNode = null;
        }
    }
}
