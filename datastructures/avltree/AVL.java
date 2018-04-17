public class AVL<E extends Comparable<E>> {
	private Node<E> root;

	public AVL(){
		root = null;
	}

	public Node<E> getRoot(){
		//returns to the top of the tree
		if (root != null) {
			while (root.getParent() != null) {
				root = root.getParent();
			}
		}
		return root;
	}

	public void insert(E data){
		// Perform a regular insert
		// Check to make sure the tree remains an AVL tree
		Node temp;
		if (root == null) {
			//if the tree is empty, our first value becomes the root
			root = new Node<E>(data);
		} else if (data.compareTo(root.getData()) < 0) {
			//if our insert data is less than root, we place it in the left subtree
			if (root.getLeftChild() == null) {
				//locate an available spot to insert our node
				temp = new Node(data);
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
				temp = new Node(data);
				temp.setParent(root);
				root.setRightChild(temp);
			} else {
				//if this right child is already taken, keep searching for another spot
				root = root.getRightChild();
				insert(data);
			}
		}
		Node subtree = root;
		checkHeights(subtree);
		while (subtree.getParent() != null) {
			checkHeights(subtree.getParent());
			subtree = subtree.getParent();
		}
		subtree = root;
		// check for unbalance
		checkUnbalance(subtree);
		getRoot();
	}

	public Node<E> search(E data){
		// Return the node that corresponds with the given data
		// Note: No need to worry about duplicate values added to the tree
		Node result = null;
		// search the tree for a node whose data field is equal to data
		if (root == null) {
			return result;
		}
		// data matches our search criteria
		else if (root.getData().compareTo(data) == 0) {
			result = root;
		} 
		// search criteria is larger than our node value, search right tree
		else if (data.compareTo(root.getData()) > 0) {
			if (root.getRightChild() != null) {
				root = root.getRightChild();
				search(data);
			}
		} 
		// search criteria is lesser than our node value, search left tree
		else if (data.compareTo(root.getData()) < 0) {
			if (root.getLeftChild() != null) {
				root = root.getLeftChild();
				search(data);
			}
		}
		// no results, return null
		getRoot();
		return result;
	}

	public void delete(E data){
		if (root == null) {
			//tree is empty or we were unable to find the value
			return;
		}
		if (root.getData().compareTo(data) == 0) {
			//we found the value! now we need to look at different cases for deletion
			if (root.getLeftChild() == null && root.getRightChild() == null) {
				//node is external! easiest case to remove
				if (root.getParent() == null) {
					//the tree consists of a single node, set it to null
					root = null;
					return;
				}
				else if (root.getData().compareTo(root.getParent().getData()) > 0) {
					//node is a right child
					root = root.getParent();
					root.setRightChild(null);
					return;
				} 
				else {
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
		//unable to locate the node, returning
		Node subtree = root;
		checkHeights(subtree);
		while (subtree.getParent() != null) {
			checkHeights(subtree.getParent());
			subtree = subtree.getParent();
		}
		subtree = root;

		// check for unbalance
		checkUnbalance(subtree);
		getRoot();
	}

	public void traverse(String order, Node<E> top) {
		if (top != null){
			switch (order) {
			case "preorder":
				if (top.getData() != null) {
					System.out.print(top.getData().toString() + " ");
					traverse("preorder", top.getLeftChild());
					traverse("preorder", top.getRightChild());
				}
				break;
			case "inorder":
				if (top.getData() != null) {
					traverse("inorder", top.getLeftChild());
					System.out.print(top.getData().toString() + " ");
					traverse("inorder", top.getRightChild());
				}
				break;
			case "postorder":
				if (top.getData() != null) {
					traverse("postorder", top.getLeftChild());
					traverse("postorder", top.getRightChild());
					System.out.print(top.getData().toString() + " ");
				}
				break;
			}
		}
	}

	//perform a right rotation
	void rightRotate(Node<E> a){
		Node<E> b = a.getLeftChild();
		b.setParent(a.getParent());
		a.setLeftChild(b.getRightChild());
		if (a.getLeftChild() != null) {
			a.getLeftChild().setParent(a);
		}
		b.setRightChild(a);
		a.setParent(b);

		if (b.getParent() != null) {
			if (b.getParent().getRightChild() == a) {
				b.getParent().setRightChild(b);
			} else {
				b.getParent().setLeftChild(b);
			}
		}
		updateHeights(a, b);
		root = b;
	}

	//perform a left rotation
	void leftRotate(Node<E> a){
		Node<E> b = a.getRightChild();
		b.setParent(a.getParent());
		a.setRightChild(b.getLeftChild());
		if (a.getRightChild() != null) {
			a.getRightChild().setParent(a);
		}
		b.setLeftChild(a);
		a.setParent(b);

		if (b.getParent() != null) {
			if (b.getParent().getRightChild() == a) {
				b.getParent().setRightChild(b);
			} else {
				b.getParent().setLeftChild(b);
			}
		}
		updateHeights(a, b);
		root = b;
	}

	// updates the height of the tree recursively
	void checkHeights(Node node) {
		int left, right;
		if (node.getLeftChild() == null) {
			left = 0;
		} else {
			left = node.getLeftChild().getHeight();
		}
		if (node.getRightChild() == null) {
			right = 0;
		} else {
			right = node.getRightChild().getHeight();
		}
		node.setHeight(max(left, right)+1);
	}

	// a utility function to update the heights of two nodes
	private void updateHeights(Node<E> x, Node<E> y) {
		int xleft, xright, yleft, yright;
		if (x.getLeftChild() == null) {
			xleft = 0;
		} else {
			xleft = x.getLeftChild().getHeight();
		}
		if (x.getRightChild() == null) {
			xright = 0;
		} else {
			xright = x.getRightChild().getHeight();
		}

		if (y.getLeftChild() == null) {
			yleft = 0;
		} else {
			yleft = y.getLeftChild().getHeight();
		}
		if (y.getRightChild() == null) {
			yright = 0;
		} else {
			yright = y.getRightChild().getHeight();
		}		
		y.setHeight(max(yleft, yright)+1);
		x.setHeight(max(xleft, xright)+1);
	}

	// check the balance of a node
	private int getBalance(Node<E> node) {
		if (node == null) {
			return 0;
		}
		// node with 0 children has a height of 1, and a balance of 0
		if ((node.getLeftChild() == null) && (node.getRightChild() == null)){
			return 0;
		}
		// nodes with 1 child only have a balance of non-null node height
		else if ((node.getLeftChild() == null)){
			return (0 - node.getRightChild().getHeight());
		}
		else if (node.getRightChild() == null) {
			return node.getLeftChild().getHeight();	
		}
		// node with 2 children
		else {
			return node.getLeftChild().getHeight() - node.getRightChild().getHeight();			
		}
	}

	// a utility function to get maximum of two integers
	private int max(int a, int b) {
		return (a > b) ? a : b;
	}

	// perform rebalance operations
	private void rebalance(Node<E> n, int balance) {
		if (balance > 1) {
			if (n.getLeftChild().getRightChild() == null) {
				rightRotate(n);
			}
			else if (n.getLeftChild().getLeftChild() == null) {
				leftRotate(n.getLeftChild());
				rightRotate(root);
			}
			else if (n.getLeftChild().getLeftChild().getHeight() >= (n.getLeftChild().getRightChild().getHeight())) {
				rightRotate(n);
			}
			else {
				leftRotate(n.getLeftChild());
				rightRotate(root);
			}
		}
		else if (balance < -1) {
			if (n.getRightChild().getLeftChild() == null) {
				leftRotate(n);
			}
			else if (n.getRightChild().getRightChild() == null) {
				rightRotate(n.getRightChild());
				leftRotate(root);
			}
			else if (getBalance(n.getRightChild().getRightChild()) >= getBalance(n.getRightChild().getLeftChild())) {
				leftRotate(n);
			}
			else {
				rightRotate(n.getRightChild());
				leftRotate(root);
			}
		}
		root = n;
	}


	void checkUnbalance(Node<E> subtree) {
		int balance;
		while (subtree.getParent() != null) {
			balance = getBalance(subtree);
			if (balance > 1 || balance < -1) {
				rebalance(subtree, balance);
				break;
			}
			subtree = subtree.getParent();
		} //check the root as well
		if (subtree != null && subtree.getParent() == null) {
			balance = getBalance(subtree);
			if (balance > 1 || balance < -1) {
				rebalance(subtree, balance);
			}
		}
	}
}