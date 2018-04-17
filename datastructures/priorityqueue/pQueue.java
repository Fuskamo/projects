public class pQueue<E extends Comparable> {
    private MinHeap<E> myMinHeap;

    public pQueue (int s) {
    	myMinHeap = new MinHeap<E>(s);
    }

    public void insert(E data){
    	myMinHeap.insert(data);
    }

    public Comparable<E> findMin(){
        return myMinHeap.findMin();
    }

    public Comparable<E> removeMin(){
        return myMinHeap.extract();
    }

    public boolean isEmpty(){
        // Return true when the priority queue is empty
        // Hint: Do the actual printing in your HW3.java
    	if (myMinHeap.getLength() < 1) {
    		return true;
    	}
    	return false;
    }

    public void print(){
        // print out Current Queue: 
        // followed by each element separated by a comma. 
        // Do not add spaces between your elements.
    	
    	E[] myArray = (E[]) myMinHeap.getArray();
    	System.out.print("Current Queue: ");
    	for (int i = 1; i < myMinHeap.getLength(); i++) {
    		System.out.print(myArray[i]+",");
    	}
    	System.out.println(myArray[myMinHeap.getLength()]);
    }
}