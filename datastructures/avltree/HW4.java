import java.util.Scanner;

public class HW4 {
	public static void main(String[] args){
		AVL<Integer> myAVL = new AVL<Integer>();
		int data;
		String input;
		Scanner scan = new Scanner(System.in);
		while (scan.hasNext()) {
			input = scan.next();
			switch (input) {
			case "insert":
				data = scan.nextInt();
				myAVL.insert(data);
				break;
			case "delete":
				data = scan.nextInt();
				myAVL.delete(data);
				break;
			case "search":
				data = scan.nextInt();
				if (myAVL.search(data) == null){
					System.out.println("Not Found");
				} else {
					System.out.println("Found");
				}
				break;
			case "traverse" :
				myAVL.traverse("preorder", myAVL.getRoot());
				System.out.println();
				break;
			case "exit" :
				scan.close();
				System.out.println("Successful Exit");
				System.exit(0);
			default:
				break;
			}
		}
	}
}