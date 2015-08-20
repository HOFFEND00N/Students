﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Mp3TagLib
{
    public class Analyzer
    {
        private Tager _tager;
        private Func<string, bool> _filter; 

        public Analyzer(Tager tager)
        {
            _tager = tager;
            SynchronizedFiles = new List<IMp3File>();
            NotSynchronizedFiles = new Dictionary<IMp3File, string>();
            ErrorFiles = new Dictionary<string, string>();
        }

        public Analyzer(Tager tager,Func<string, bool> filter):this(tager)
        {
            _filter = filter;
        }

        public List<IMp3File> SynchronizedFiles { get; private set; }

        public Dictionary<IMp3File,string> NotSynchronizedFiles { get; private set; }

        public Dictionary<string, string> ErrorFiles { get; private set; }


        IEnumerable<string> Filtrate(IEnumerable<string> paths)
        {
            if (_filter != null)
                return paths.Where(_filter);
            return paths;
        }

        public void Analyze(IEnumerable<string> paths,Mask mask)
        {
            foreach (var path in Filtrate(paths))
            {
                if (_tager.Load(path))
                {
                    if (!_tager.ValidateFileName(mask))
                    {
                        NotSynchronizedFiles.Add(_tager.CurrentFile,GetFileInfo(mask));
                    }
                    else
                    {
                        SynchronizedFiles.Add(_tager.CurrentFile);
                    }
                }
                else
                {
                    ErrorFiles.Add(path,"load error");
                }
            }
        }

        string GetFileInfo(Mask mask)
        {
            var badTags = _tager.GetIncorectTags();
            StringBuilder builder = new StringBuilder();
            bool maskContainsBadTag = false;
           
            foreach (var badTag in badTags)
            {
                if (mask.Contains(badTag.ToString().ToLower()))
                {
                    
                    maskContainsBadTag = true;
                    builder.Append(badTag + " is empty;");
                }
            }
           
            if(maskContainsBadTag)
            return "Bad tags:" + builder;
            
            return "Bad name";
        }
 
    }
}
