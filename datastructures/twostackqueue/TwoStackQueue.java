public class TwoStackQueue<E> {
	private Node<E> top0;
	private Node<E> top1;

	public TwoStackQueue(){
		top0 = null;
		top1 = null;
	}

	public void enqueue(E newData){
		Node<E> temp = new Node<>(newData, top1);
		top1 = temp;
	}

	public Node<E> dequeue(){
		if (isEmpty0()) {
			switchStacks();
			if (isEmpty0()) {
				return null;
			}
		}
		Node<E> temp = top0;
		top0 = top0.getNext();	
		return temp;
	}

	private void switchStacks(){
		while (!isEmpty1()) {
			Node<E> temp = pop();
			push(temp.getData());
		}
	}
	
	private Node<E> pop(){
		if (isEmpty1()) {
			return null;
		}
		Node<E> temp = top1;
		top1 = top1.getNext();
		return temp;
	}
	
	private void push(E newData){
		Node<E> temp = new Node<>(newData, top0);
		top0 = temp;
	}

	public boolean isEmpty1(){
		//Check if the Stack is empty
		if (top1 == null) {
			return true;
		}
		return false;
	}

	public boolean isEmpty0(){
		//Check if the Stack is empty
		if (top0 == null) {
			return true;
		}
		return false;
	}
	
	private String emptyAll() {
		String printString = new String();
		while (!isEmpty0()) {
			Node<E> temp = dequeue();
			printString += temp.getData();
		}
		return printString;
	}

	public void printQueue(){
		// Loop through your stack and print each Node's data
		String printString = new String();
		printString += emptyAll();
		if (!isEmpty1()) {
			switchStacks();
			printString += emptyAll();
		}
		System.out.println("TwoStackQueue Output: "+printString);
	}
}