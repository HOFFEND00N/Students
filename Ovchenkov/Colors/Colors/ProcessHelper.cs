﻿using System;
using System.Collections.Generic;
using System.Reflection;

namespace Colors
{
    public class ProcessHelper<TProc>
    {
        private delegate void ProcessDelegate<in TColorOne, in TColorTwo>(TColorOne colorOne, TColorTwo colorTwo);
        private delegate void ProcessDelegate<in TColor>(TColor color);

        private readonly IDictionary<String, Delegate> _methodsDictionary;

        public ProcessHelper(TProc processor)
        {
            _methodsDictionary = GetMethodsDictionary(processor);
        }

        private IDictionary<String, Delegate> GetMethodsDictionary(TProc processor)
        {
            var map = new Dictionary<String, Delegate>();

            foreach (var methodInfo in typeof(TProc).GetMethods())
            {
                var parameters = methodInfo.GetParameters();
                Tuple<String, Delegate> argumentMethodPair;

                if (parameters.Length == 2)
                {
                    argumentMethodPair = AddMethodWithTwoArguments(processor, parameters, methodInfo);
                }
                else if (parameters.Length == 1)
                {
                    argumentMethodPair = AddMethodWithOneArgument(processor, parameters[0], methodInfo);
                }
                else
                {
                    throw new ArgumentException(String.Format(
                        "Метод '{0}' имеет некоректное количество параметров", methodInfo.Name));
                }
                map.Add(argumentMethodPair.Item1, argumentMethodPair.Item2);
            }
            return map;
        }

        private static Tuple<String, Delegate > AddMethodWithOneArgument(TProc processor, ParameterInfo argument, MethodInfo methodInfo)
        {
            var argumentType = argument.ParameterType.ToString();
            var method = 
                Delegate.CreateDelegate(typeof(ProcessDelegate<>).MakeGenericType(typeof(TProc),
                argument.ParameterType), processor, methodInfo);

            return new Tuple<String, Delegate>(argumentType, method);
        }

        private static Tuple<String, Delegate> AddMethodWithTwoArguments(TProc processor, ParameterInfo[] arguments, MethodInfo methodInfo)
        {
            var argumentsType = new Tuple<Type, Type>(arguments[0].ParameterType, arguments[1].ParameterType);
            var method = 
                Delegate.CreateDelegate(typeof (ProcessDelegate<,>).MakeGenericType(typeof (TProc),
                arguments[0].ParameterType, arguments[1].ParameterType), processor, methodInfo);

            return new Tuple<String, Delegate>(argumentsType.ToString(), method);
        }

        public void Process<TColorOne, TColorTwo>(TColorOne colorOne, TColorTwo colorTwo)
        {
            Delegate del;
            var key = new Tuple<TColorOne, TColorTwo>(colorOne, colorTwo).ToString();
            if (!_methodsDictionary.TryGetValue(key, out del))
                throw new ApplicationException(string.Format("Тип не содержится в интерфейсе посетителя"));

           _methodsDictionary[key].DynamicInvoke(colorOne, colorTwo);
        }

        public void Process<TColor>(TColor color)
        {
            Delegate del;
            var key = color.ToString();
            if (!_methodsDictionary.TryGetValue(key, out del))
                throw new ApplicationException(string.Format("Тип не содержится в интерфейсе посетителя"));

            _methodsDictionary[key].DynamicInvoke(color);
        }
    }
}
