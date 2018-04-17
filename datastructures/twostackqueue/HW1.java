import java.util.Scanner;

public class HW1 {
	public static void main(String[] args){

		// Create a Scanner that reads system input

		// Loop over the scanner's input
		// For each line of the input, send it to isPalindrome()
		// If isPalindrome returns true, print "This is a Palindrome." 
		// Otherwise print "Not a Palindrome."
		// Close the Scanner		
		Scanner scan = new Scanner(System.in);
		int loops = Integer.parseInt(scan.nextLine());
		for (int i = 0; i <= loops - 1; loops++) {
			if (isPalindrome(scan.nextLine())) {
				System.out.println("This is a Palindrome.");
			}
			else {
				System.out.println("Not a Palindrome.");
			}
		}
	}

	public static boolean isPalindrome(String s){

		// Create a stack and a Queue of chars that represents the passed in string
		// Hint: While you loop through the given string, push the same char onto your stack
		//		 that you enqueue into your Queue. This way you can use dequeue to get 
		//       the string from left to right, but you pop the string from right to left
		// Compare your Queue and Stack to see if the input String was a Palindrome or not	
		TwoStackQueue<Character> queue = new TwoStackQueue<Character>();
//		Queue<Character> queue = new Queue<Character>();
		Stack<Character> stack = new Stack<Character>();
		for(int i = 0; i < s.length(); i++){
			queue.enqueue(s.charAt(i));
			stack.push(s.charAt(i));
		}
		for(int i = 0; i < s.length(); i++){
			Node p = stack.pop();
			Node q = queue.dequeue();
			if (!p.getData().equals(q.getData())) {
				return false;
			}
		}
		return true;
	}
}
