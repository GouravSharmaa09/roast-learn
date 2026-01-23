import { useState, useEffect, useCallback } from 'react';
import { Language } from '@/types/roast';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  buggyCode: string;
  language: Language;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ChallengeState {
  completedToday: boolean;
  lastCompletedDate: string | null;
  totalCompleted: number;
  currentStreak: number;
}

const CHALLENGE_STATE_KEY = 'daily_challenge_state';

// 30 unique daily challenges that rotate
const CHALLENGES: Omit<DailyChallenge, 'id'>[] = [
  {
    title: "Loop Lagatar",
    description: "Ye loop kabhi khatam nahi hota. Fix karo before your CPU melts! 🔥",
    buggyCode: `for (let i = 10; i > 0; i++) {
  console.log(i);
}`,
    language: 'javascript',
    hint: "Loop condition dekh bhai, i badhta ja raha hai",
    difficulty: 'easy'
  },
  {
    title: "Undefined ka Darr",
    description: "Ye function undefined return karta hai. Kya galat hai?",
    buggyCode: `function getFirstItem(arr) {
  if (arr.length > 0)
    return arr[0]
}

const result = getFirstItem([]);
console.log(result.toUpperCase());`,
    language: 'javascript',
    hint: "Empty array ka case handle nahi hua",
    difficulty: 'easy'
  },
  {
    title: "Async Confusion",
    description: "Data fetch ho raha hai but print nahi ho raha properly. Why?",
    buggyCode: `async function fetchUser() {
  const response = await fetch('/api/user');
  return response.json();
}

const userData = fetchUser();
console.log(userData.name);`,
    language: 'javascript',
    hint: "Async function ka return value kya hota hai?",
    difficulty: 'medium'
  },
  {
    title: "Python Indent Issue",
    description: "IndentationError aa raha hai. Find and fix karo!",
    buggyCode: `def greet(name):
print(f"Hello, {name}")
  return True`,
    language: 'python',
    hint: "Python mein indentation matter karti hai",
    difficulty: 'easy'
  },
  {
    title: "List Modification Bug",
    description: "Loop ke andar list modify karna - classic trap!",
    buggyCode: `numbers = [1, 2, 3, 4, 5]
for num in numbers:
    if num % 2 == 0:
        numbers.remove(num)
print(numbers)`,
    language: 'python',
    hint: "List iterate karte waqt modify mat kar",
    difficulty: 'medium'
  },
  {
    title: "Pointer Nightmare",
    description: "C++ pointer se memory leak ho rahi hai!",
    buggyCode: `int* createArray() {
    int arr[5] = {1, 2, 3, 4, 5};
    return arr;
}

int main() {
    int* ptr = createArray();
    cout << ptr[0];
}`,
    language: 'cpp',
    hint: "Local array ka pointer return karna danger hai",
    difficulty: 'hard'
  },
  {
    title: "Null Check Missing",
    description: "NullPointerException ka classic case!",
    buggyCode: `public class Main {
    public static void main(String[] args) {
        String name = null;
        System.out.println(name.length());
    }
}`,
    language: 'java',
    hint: "Null value pe method call nahi kar sakte",
    difficulty: 'easy'
  },
  {
    title: "Off By One",
    description: "Array bounds exceed ho raha hai!",
    buggyCode: `const items = ['a', 'b', 'c'];
for (let i = 0; i <= items.length; i++) {
  console.log(items[i]);
}`,
    language: 'javascript',
    hint: "Array length 3 hai, last valid index kya hoga?",
    difficulty: 'easy'
  },
  {
    title: "Closure Trap",
    description: "Loop mein setTimeout use karna - tricky situation!",
    buggyCode: `for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}`,
    language: 'javascript',
    hint: "var vs let ka scope difference dekho",
    difficulty: 'medium'
  },
  {
    title: "String Immutability",
    description: "Python string ko modify karna kyu kaam nahi kar raha?",
    buggyCode: `name = "hello"
name[0] = "H"
print(name)`,
    language: 'python',
    hint: "Python mein strings immutable hain",
    difficulty: 'easy'
  },
  {
    title: "Reference vs Copy",
    description: "Object copy kiya but original bhi change ho gaya!",
    buggyCode: `const original = { name: 'Rahul', scores: [90, 85] };
const copy = original;
copy.name = 'Priya';
console.log(original.name);`,
    language: 'javascript',
    hint: "Object assign karna reference copy karta hai",
    difficulty: 'medium'
  },
  {
    title: "Float Comparison",
    description: "0.1 + 0.2 === 0.3 kyu false hai?",
    buggyCode: `const a = 0.1;
const b = 0.2;
const c = 0.3;

if (a + b === c) {
  console.log("Equal!");
} else {
  console.log("Not equal!");
}`,
    language: 'javascript',
    hint: "Floating point precision issue",
    difficulty: 'medium'
  },
  {
    title: "Global Variable",
    description: "Ye variable automatically global kaise ban gaya?",
    buggyCode: `function setCount() {
  count = 10;
}

setCount();
console.log(count);`,
    language: 'javascript',
    hint: "Variable declare karna bhool gaye!",
    difficulty: 'easy'
  },
  {
    title: "Dictionary Default",
    description: "KeyError aa raha hai. Handle kaise karein?",
    buggyCode: `scores = {"math": 90, "science": 85}
print(scores["english"])`,
    language: 'python',
    hint: ".get() method use karo",
    difficulty: 'easy'
  },
  {
    title: "Array Methods",
    description: "Push return value galat use ho raha hai!",
    buggyCode: `const numbers = [1, 2, 3];
const newArray = numbers.push(4);
console.log(newArray);`,
    language: 'javascript',
    hint: "push() kya return karta hai?",
    difficulty: 'easy'
  },
  {
    title: "Type Coercion",
    description: "JavaScript ka type jugaad samjho!",
    buggyCode: `const value = "5";
const result = value + 2;
console.log(result);`,
    language: 'javascript',
    hint: "String + number = ?",
    difficulty: 'easy'
  },
  {
    title: "Recursion Overflow",
    description: "Stack overflow! Base case missing hai.",
    buggyCode: `def factorial(n):
    return n * factorial(n - 1)

print(factorial(5))`,
    language: 'python',
    hint: "Recursion ko kab rokna hai?",
    difficulty: 'medium'
  },
  {
    title: "Event Handler",
    description: "onClick mein function call ho raha hai!",
    buggyCode: `function App() {
  const handleClick = () => {
    alert("Clicked!");
  };
  
  return (
    <button onClick={handleClick()}>
      Click me
    </button>
  );
}`,
    language: 'javascript',
    hint: "Function reference vs function call",
    difficulty: 'easy'
  },
  {
    title: "Mutable Default",
    description: "Python ka famous mutable default argument trap!",
    buggyCode: `def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))
print(add_item("b"))`,
    language: 'python',
    hint: "Default mutable argument persist karta hai",
    difficulty: 'hard'
  },
  {
    title: "Integer Overflow",
    description: "Bade numbers ke sath calculation galat aa raha hai!",
    buggyCode: `public class Main {
    public static void main(String[] args) {
        int a = 2000000000;
        int b = 2000000000;
        int sum = a + b;
        System.out.println(sum);
    }
}`,
    language: 'java',
    hint: "int ki maximum value kitni hoti hai?",
    difficulty: 'medium'
  },
  {
    title: "Promise Chain",
    description: "Promise chain break ho raha hai!",
    buggyCode: `fetch('/api/data')
  .then(response => {
    response.json()
  })
  .then(data => {
    console.log(data);
  })`,
    language: 'javascript',
    hint: "First .then() mein return missing hai",
    difficulty: 'medium'
  },
  {
    title: "Scope Leak",
    description: "Variable block ke bahar accessible hai!",
    buggyCode: `if (true) {
  var secret = "password123";
}
console.log(secret);`,
    language: 'javascript',
    hint: "var ka scope function level hota hai",
    difficulty: 'easy'
  },
  {
    title: "String Formatting",
    description: "F-string mein expression galat likha hai!",
    buggyCode: `name = "Rahul"
age = 25
print(f"Name: {name}, Age: {age + }")`,
    language: 'python',
    hint: "F-string expression incomplete hai",
    difficulty: 'easy'
  },
  {
    title: "Array Destructuring",
    description: "Destructuring se undefined aa raha hai!",
    buggyCode: `const person = { name: 'Raj' };
const { name, age } = person;
console.log(age.toString());`,
    language: 'javascript',
    hint: "age property exist nahi karti",
    difficulty: 'easy'
  },
  {
    title: "Vector Out of Bounds",
    description: "C++ vector access mein segfault!",
    buggyCode: `#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    cout << v[10] << endl;
    return 0;
}`,
    language: 'cpp',
    hint: "Vector bounds check nahi karti",
    difficulty: 'medium'
  },
  {
    title: "Equality Check",
    description: "== vs === ka farak samjho!",
    buggyCode: `const num = "5";
if (num == 5) {
  console.log("Five!");
}
// But later...
if (num === 5) {
  console.log("Strictly Five!");
}`,
    language: 'javascript',
    hint: "Type coercion vs strict equality",
    difficulty: 'easy'
  },
  {
    title: "Division Issue",
    description: "Python 2 vs 3 division problem!",
    buggyCode: `# Python 3
result = 5 / 2
print(int(result))  # Expected: 2

# But what about:
result2 = 5 // 2.0
print(result2)`,
    language: 'python',
    hint: "// operator kya return karta hai?",
    difficulty: 'medium'
  },
  {
    title: "Memory Leak",
    description: "setInterval clear nahi ho raha!",
    buggyCode: `function startTimer() {
  let count = 0;
  setInterval(() => {
    count++;
    console.log(count);
  }, 1000);
}

// Component unmount pe kya hoga?`,
    language: 'javascript',
    hint: "Interval ID save karke clearInterval karo",
    difficulty: 'medium'
  },
  {
    title: "Try-Catch Scope",
    description: "Variable try block ke bahar accessible nahi!",
    buggyCode: `try {
  const data = JSON.parse('{"name": "test"}');
} catch (e) {
  console.log("Error");
}
console.log(data.name);`,
    language: 'javascript',
    hint: "const ka scope block level hota hai",
    difficulty: 'easy'
  },
  {
    title: "Static Variable",
    description: "Class variable vs instance variable!",
    buggyCode: `class Counter:
    count = 0
    
    def increment(self):
        Counter.count += 1

c1 = Counter()
c2 = Counter()
c1.increment()
print(c2.count)  # Kya print hoga?`,
    language: 'python',
    hint: "Class variable shared hota hai",
    difficulty: 'medium'
  }
];

function getTodaysChallengeIndex(): number {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return dayOfYear % CHALLENGES.length;
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function useDailyChallenge() {
  const [state, setState] = useState<ChallengeState>({
    completedToday: false,
    lastCompletedDate: null,
    totalCompleted: 0,
    currentStreak: 0
  });

  // Load state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHALLENGE_STATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const today = getTodayDateString();
        
        // Check if completed today
        const completedToday = parsed.lastCompletedDate === today;
        
        // Reset streak if missed a day
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let streak = parsed.currentStreak;
        if (parsed.lastCompletedDate !== today && parsed.lastCompletedDate !== yesterdayStr) {
          streak = 0;
        }
        
        setState({
          ...parsed,
          completedToday,
          currentStreak: streak
        });
      }
    } catch (error) {
      console.error('Failed to load daily challenge state:', error);
    }
  }, []);

  const getTodaysChallenge = useCallback((): DailyChallenge => {
    const index = getTodaysChallengeIndex();
    const challenge = CHALLENGES[index];
    return {
      ...challenge,
      id: `challenge_${getTodayDateString()}`
    };
  }, []);

  const markCompleted = useCallback(() => {
    const today = getTodayDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const newStreak = (state.lastCompletedDate === yesterdayStr || state.currentStreak === 0) 
      ? state.currentStreak + 1 
      : 1;
    
    const newState: ChallengeState = {
      completedToday: true,
      lastCompletedDate: today,
      totalCompleted: state.totalCompleted + 1,
      currentStreak: newStreak
    };
    
    localStorage.setItem(CHALLENGE_STATE_KEY, JSON.stringify(newState));
    setState(newState);
  }, [state]);

  const getTimeUntilNextChallenge = useCallback((): string => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }, []);

  return {
    challenge: getTodaysChallenge(),
    state,
    markCompleted,
    getTimeUntilNextChallenge
  };
}
