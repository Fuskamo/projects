import java.util.Scanner;

public class TestContents{
    public static void main(String[] args){
        Scanner scan = new Scanner(System.in);
        TwoStackQueue<Character> queue2 = new TwoStackQueue<Character>();
        Queue<Character> queue = new Queue<Character>();
        Stack<Character> stack = new Stack<Character>();
        while (scan.hasNext()){
            String input = scan.nextLine();
            for(int i = 0; i < input.length(); i++){
                queue.enqueue(input.charAt(i));
                stack.push(input.charAt(i));
                queue2.enqueue(input.charAt(i));
            }
            stack.printStack();
            queue.printQueue();
            queue2.printQueue();
        }
        scan.close();
    }
}