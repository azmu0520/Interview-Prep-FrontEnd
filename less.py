
 counts , countT = {}

 if s[i] in counts:
    counts[s[i]] += counts.get(s[i],0) + 1
    counts[t[i]] += counts.get(t[i],0) + 1

return counts == countT


 