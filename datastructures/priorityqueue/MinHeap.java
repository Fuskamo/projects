public class MinHeap<E extends Comparable> {
	private E[] myArray;
	private int maxSize;
	private int length;


	public MinHeap(int s){
		myArray = (E[]) (new Comparable[s+1]);
		setMaxSize(s+1);
		setLength(0);
	}

	public E[] getArray(){
		return myArray;
	}

	public void setArray(E[] newArray){
		myArray = newArray;
	}

	public int getMaxSize(){
		return maxSize;
	}

	public void setMaxSize(int ms){
		maxSize = ms;
	}

	public int getLength(){
		return length;
	}

	public void setLength(int l){
		length = l;
	}

	// Other Methods
	public void insert(E data){
		setLength(getLength()+1);
		myArray[getLength()] = data;
		if (getLength() > 1) {
		bubbleUp(getLength(), (int) Math.floor(getLength()/2));
		}
		
		// Insert an element into your heap.
		// When adding a node to your heap, remember that for every node n, 
		// the value in n is less than or equal to the values of its children, 
		// but your heap must also maintain the correct shape.
		// (ie there is at most one node with one child, and that child is the left child.)
		// (Additionally, that child is farthest left possible.)
	}

	private void bubbleUp(int child, int parent) {
		if (myArray[child].compareTo(myArray[parent]) < 0 && myArray[child] != null) {
			E temp = myArray[child];
			myArray[child] = myArray[parent];	//swap the node values
			myArray[parent] = temp;
			child = parent;
			parent = (int) Math.floor(child/2);
			bubbleUp(child, parent);			//check if we need to swap again
		}
		return;
	}

	private void bubbleDown(int parent, int left, int right) {
		if (myArray[left] == null) {
			return; 					//both nodes are null
		} 
		else if (myArray[right] == null) {
			bubble(parent, left); 		//the right node is null, but a left child exists
		}
		else if (myArray[left].compareTo(myArray[right]) < 0) {
			bubble(parent, left);		//the left child is smaller than the right
		} else {
			bubble(parent, right);		//the right child is smaller than the left
		}
		return;
	}

	private void bubble(int parent, int child) {
			//bubble elements
			E temp = myArray[child];
			myArray[child] = myArray[parent];
			myArray[parent] = temp;
			parent = child;
			bubbleDown(parent, parent*2, parent*2+1);
		}

	public Comparable<E> findMin(){
		// return the minimum value in the heap
		return myArray[1]; //if a min value does not exist, null will be returned
	}

	public Comparable<E> extract(){
		// remove and return the minimum value in the heap
		Comparable<E> returnValue = findMin();
		myArray[1] = myArray[getLength()];
		myArray[getLength()] = null;
		if (getLength() > 0) {
			setLength(getLength()-1);	//ensures we don't decrement out of index range
		}
		bubbleDown(1, 2, 3);
		return returnValue;

	}
}
