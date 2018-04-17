import java.util.Scanner;

public class HW3 {
	private static pQueue minHeapArray;
    public static void main(String[] args) {
    	// Loop over the Scanner
        // Split each line into the task and the corresponding number (if one exists)
        // Depending on what the input task was, preform the corresponding function
        //      (ie) insert, findMin, removeMin, isEmpty, or print
        // Hint: Use a switch-case statement
        // Don't forget to close your Scanner!
  	
    	Scanner scan = new Scanner(System.in);
		int lines = scan.nextInt();
		minHeapArray = new pQueue(lines);
		for (int i = 0; i < lines; i++) {
			String input = scan.next();
			switch (input) {
			case "insert":
				int data = scan.nextInt();
				minHeapArray.insert(data);
				break;
			case "removeMin":
				Comparable rMin = minHeapArray.removeMin();
				System.out.println(rMin);
				break;
			case "isEmpty":
				if (minHeapArray.isEmpty()) {
					System.out.println("Empty");
				} else {
					System.out.println("Not empty");
				}
				break;
			case "findMin":
				Comparable fMin = minHeapArray.findMin();
				System.out.println(fMin);
				break;
			case "print":
				minHeapArray.print();
				break;
			default:
				System.out.println("Invalid input file");
			}
		}
		scan.close();
   }
}
