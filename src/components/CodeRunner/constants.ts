import { Language } from "./LanguageSelector";

export const DEFAULT_CODE: Record<Language, string> = {
    typescript: `function solution(): void {
  // Write your code here
  console.log("Hello from TypeScript!");
}

solution();`,
    python: `def solution():
    # Write your code here
    print("Hello from Python!")

if __name__ == "__main__":
    solution()`,
    cpp: `#include <iostream>

using namespace std;

int main() {
    // Write your code here
    cout << "Hello from C++!" << endl;
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello from Java!");
    }
}`
};

export const LANGUAGE_IDS: Record<Language, number> = {
    cpp: 105, // C++ (GCC 14.1.0)
    java: 91, // Java (OpenJDK 17.0.6)
    python: 109, // Python (3.13.2)
    typescript: 101, // TypeScript (5.6.2)
};

