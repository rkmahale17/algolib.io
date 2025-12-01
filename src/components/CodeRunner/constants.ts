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
    cpp: 54, // C++ (GCC 9.2.0)
    java: 62, // Java (OpenJDK 13.0.1)
    python: 71, // Python (3.8.1)
    typescript: 74, // TypeScript (3.7.4)
};

