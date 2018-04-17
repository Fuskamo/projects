public class Stack<E> {
	private Node<E> top;
	
	public Stack(){
		// We want to initialize our Stack to be empty
		// (ie) Set top as null
		top = null;
	}
	
	public void push(E newData){
		// We want to create a node whose data is newData and next node is top
		// Push this new node onto the stack
		// Update top
		Node<E> temp = new Node<>(newData, top);
		top = temp;
	}
	
	public Node<E> pop(){
		// Return the Node that currently represents the top of the stack
		// Update top
		// Hint: The order you implement the above 2 tasks matters, so use a temporary node
	 	//	     to hold important information
		// Hint: Return null on a empty stack
		if (isEmpty()) {
			return null;
		}
		Node<E> temp = top;
		top = top.getNext();
		return temp;
	}
	
	public boolean isEmpty(){
		//Check if the Stack is empty
		if (top == null) {
			return true;
		}
		return false;
	}
	
	public void printStack(){
		// Loop through your stack and print each Node's data
		String printString = new String();
		while (!isEmpty()) {
			Node<E> temp = pop();			
			printString += temp.getData();
		}	
		System.out.println("Stack Output: "+printString);
	}
}