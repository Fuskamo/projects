public class Heapify {
    private static int size;
    
    private static void swap(Comparable[] array, int a, int b) {
        Comparable temp = array[a];
        array[a] = array[b];
        array[b] = temp;
    }

    private static void heapify(Comparable[] arr, int i) {
        int left = i*2;
        int right = left+1;
        int parent = i;

        if (left <= size && arr[left].compareTo(arr[parent]) > 0) parent = left;
        if (right <= size && arr[right].compareTo(arr[parent]) > 0) parent = right;
        if (parent != i) {
            swap(arr, i, parent);
            heapify(arr, parent);
        }
    }

    public static void sort(Comparable[] arr) {
        size = arr.length-1;
        for (int i = size/2; i >= 0; i--) {
            heapify(arr, i);
        }
        for (int i = size; i > 0; i--) {
            swap(arr, 0, i);
            size--;
            heapify(arr, 0);
        }
    }

    public static void main(final String[] args) {
        Integer[] arr = new Integer[] { 3, 10, 2, 17, 5, 4, 16, 23, 1, 45, 123, 234, 12, 13, 54 };
        System.out.println(java.util.Arrays.toString(arr)); //print unsorted array
        sort(arr);
        System.out.println(java.util.Arrays.toString(arr)); //print heapified array
    }
    //http://eddmann.com/posts/implementing-heapsort-in-java-and-c/
}