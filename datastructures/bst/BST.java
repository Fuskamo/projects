
public class BST<E extends Comparable<E>> {
	private Node<E> root;

	public BST(){
		root = null;
	}

	public Node<E> getRoot(){
		//returns to the top of the tree
		while (root.getParent() != null) {
			root = root.getParent();
		}
		return root;
	}

	public void insert(E data){
		// Find the right spot in the tree for the new node
		// Make sure to check if anything is in the tree
		// Hint: if a node n is null, calling n.getData() will cause an error
		Node temp;
		if (root == null) {
			//if the tree is empty, our first value becomes the root
			root = new Node<E>(data);
		} else if (data.compareTo(root.getData()) < 0) {
			//if our insert data is less than root, we place it in the left subtree
			if (root.getLeftChild() == null) {
				//locate an available spot to insert our node
				Node temp = new Node(data);
				temp.setParent(root);
				root.setLeftChild(temp);
			} else {
				//if this left child is already taken, keep searching for another spot
				root = root.getLeftChild();
				insert(data);
			}
		} else if (data.compareTo(root.getData()) > 0) {
			//if our insert data is more than root, we place it in the right subtree
			if (root.getRightChild() == null) {
				//locate an available spot to insert our node
				Node temp = new Node(data);
				temp.setParent(root);
				root.setRightChild(temp);
			} else {
				//if this right child is already taken, keep searching for another spot
				root = root.getRightChild();
				insert(data);
			}
		}
		getRoot();
	}

	public Node<E> find(E data){

		// Search the tree for a node whose data field is equal to data
		if (root == null) {
			return null;
		}
		if (root.getData().compareTo(data) == 0) {
			//data matches our search criteria
			return root;
		} else if (data.compareTo(root.getData()) > 0) {
			//search criteria is larger than our node, search right tree
			root = root.getRightChild();
			find(data);
		} else if (data.compareTo(root.getData()) < 0) {
			//search criteria is lesser than our node, search left tree
			root = root.getLeftChild();
			find(data);
		}
		getRoot();
		// no results, return null
		return null;
	}

	public void delete(E data){
		// Find the right node to be deleted

		// If said node has no children, simply remove it by setting its parent to point to null instead of it.
		// If said node has one child, delete it by making its parent point to its child.
		// If said node has two children, then replace it with its successor,
		//          and remove the successor from its previous location in the tree.
		// The successor of a node is the left-most node in the node's right subtree.
		// If the value specified by delete does not exist in the tree, then the structure is left unchanged.

		// Hint: You may want to implement a findMin() method to find the successor when there are two children

		if (root == null) {
			//tree is empty or we were unable to find the value
			return;
		}
		if (root.getData() == data) {
			//we found the value! now we need to look at different cases for deletion
			if (root.getLeftChild() == null && root.getRightChild() == null) {
				//node is external! easiest case to remove
				if (root.getParent() == null) {
					//the tree consists of a single node, set it to null
					root = null;
					return;
				}
				if (root.getData().compareTo(root.getParent().getData()) > 0) {
					//node is a right child
					root = root.getParent();
					root.setRightChild(null);
					return;
				} else {
					//node must be a left child
					root = root.getParent();
					root.setLeftChild(null);
					return;
				}
			}
			else if (root.getLeftChild() == null ^ root.getRightChild() == null) {
				//node only has one child
				if (root.getLeftChild() == null) {
					//the node is a right child
					root.getParent().setRightChild(root.getRightChild());
					root.getRightChild().setParent(root.getParent());
					root = root.getParent();
					return;
				} else {
					//the node must be a left child if it isnt a right child
					root.getParent().setLeftChild(root.getLeftChild());
					root.getLeftChild().setParent(root.getParent());
					root = root.getParent();
					return;
				}
			}
			else {
				//the node has two children, we need to locate the successor
				if (root.getRightChild().getLeftChild() == null) {
					//if the right subtree does not have a left child, it is the smallest val in the tree
					root.getRightChild().setParent(root.getParent());
					root.getRightChild().setLeftChild(root.getLeftChild());
					root.getLeftChild().setParent(root.getRightChild());
					return;
				} else {
					//locate the left most node of the right child
					Node temp = root.getRightChild();
					while (temp.getLeftChild() != null) {
						temp = temp.getLeftChild();
					}
					if (temp.getRightChild() == null) {
						//we found an external left node
						temp.getParent().setLeftChild(null);
						root.setData((E)(temp.getData()));
						return;
					} else {
						//the most eligible node has a right child
						root.setData((E)(temp.getData()));
						temp.getRightChild().setParent(temp.getParent());
						temp.getParent().setLeftChild(temp.getRightChild());
						return;
					}
				}
			}
		}
		//continue searching for node
		if (data.compareTo(root.getData()) < 0) {
			root = root.getLeftChild();
			delete(data);
		} else if (data.compareTo(root.getData()) > 0) {
			root = root.getRightChild();
			delete(data);
		}
		if (root.getParent() != null) {
			getRoot();
		}
		//unable to locate the node, returning
		return;
	}

	void preorder(Node<E> node) {
		if (node != null) {
			System.out.print(node.getData()+" ");
			preorder(node.getLeftChild());
			preorder(node.getRightChild());
		}
	}

	void postorder(Node<E> node) {
		if (node != null) {
			postorder(node.getLeftChild());
			postorder(node.getRightChild());
			System.out.print(node.getData()+" ");
		}
	}

	void inorder(Node<E> node) {
		if (node != null) {
			inorder(node.getLeftChild());
			System.out.print(node.getData()+" ");
			inorder(node.getRightChild());
		}
	}

	public void traverse(String order, Node<E> top) {
		if (top != null){
			switch (order) {
			case "preorder":
				preorder(top);
				System.out.println("");
				break;
			case "inorder":
				inorder(top);
				System.out.println("");
				break;
			case "postorder":
				postorder(top);
				System.out.println("");
				break;
			}
		}
	}
}
