import java.util.Scanner;

public class HW2 {
	private static BST tree = new BST();

	public static void main(String[] args) {

		// Loop over the Scanner
		// Split each line into the task and the corresponding number (if one exists)
		// Depending on what the input task was, preform the corresponding function
		//      (ie) insert, delete, find, inorder, preorder, or postorder
		// Hint: Use a switch-case statement

		// Don't forget to close your Scanner!
		Scanner scan = new Scanner(System.in);
		int lines = scan.nextInt();
		for (int i = 0; i < lines; i++) {
			String input = scan.next();
			switch (input) {
			case "insert":
				int data = scan.nextInt();
				tree.insert(data);
				break;
			case "delete":
				data = scan.nextInt();
				tree.delete(data);
				break;
			case "find":
				data = scan.nextInt();
				tree.find(data);
				break;
			default:
				tree.traverse(input, tree.getRoot());
			}
		}
		scan.close();


		// USE THIS TO TEST EXTRA CREDIT
		//	System.out.println("isomorphic? -"+isIsomorphic(tree.getRoot(), tree.getRoot()));
	}

	static boolean isIsomorphic(Node n1, Node n2) {
		// if both roots are NULL, trees isomorphic by definition
		if (n1 == null && n2 == null)
			return true;

		// if they don’t have the same number of subtrees they cannot be isomorphic 
		if (n1 == null || n2 == null)
			return false;

		// Either the tree has been flipped, or it hasn’t been flipped
		// Check each side of the tree recursively 
		return (isIsomorphic(n1.getLeftChild(), n2.getLeftChild()) && isIsomorphic(n1.getRightChild(), n2.getRightChild())) 
				|| (isIsomorphic(n1.getLeftChild(), n2.getRightChild()) && isIsomorphic(n1.getRightChild(), n2.getLeftChild()));
	}

}