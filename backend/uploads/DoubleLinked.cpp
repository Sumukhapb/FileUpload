#include <iostream>
using namespace std;

int count = 0;
class Node
{
public:
    int data;
    Node *next;
    Node *prev;
};

Node *head = NULL, *newNode = NULL, *temp1, *temp2, *temp;

void create()
{
    Node *temp = new Node();
    cout << "Enter data for new node ";
    cin >> temp->data;
    temp->prev = NULL;
    temp->next = NULL;
    newNode = temp;
    count++;
}
void printList()
{
    Node *temp = head;
    while (temp != NULL)
    {
        cout << temp->data << " ";
        temp = temp->next;
    }

    cout << endl;
}

void insertAtBeginning()
{
    if (head == NULL)
    {
        create();
        head = newNode;
    }
    else
    {
        create();
        newNode->next = head;
        head->prev = newNode;
        head = newNode;
    }
}
void insertAtend()
{
    if (head == NULL)
    {
        insertAtBeginning();
        return;
    }
    else
    {
        temp1 = head;
        while (temp1->next != NULL)
        {
            temp1 = temp1->next;
        }
        create();
        temp1->next = newNode;
        newNode->prev = temp1;
    }
}
void insertpos()
{
    int pos, count = 0;
    cout << "enter the pos ";
    cin >> pos;
    if (pos == 0)
    {
        insertAtBeginning();
        return;
    }
    temp1 = head;
    while (temp1 != NULL)
    {
        temp1 = temp1->next;
        count++;
    }
    // cout<<count;
    if (pos >= count)
    {
        insertAtend();
        return;
    }
    temp1 = head;
    int i = 0;
    for (i = 0; i < pos - 1; i++)
    {
        temp1 = temp1->next;
    }
    create();
    newNode->next = temp1->next;
    if (temp1->next == nullptr)
    {
        // temp1->next->prev = newNode;
    }
    else
    {
        temp1->next->prev = newNode;
    }
    newNode->prev = temp1;
    temp1->next = newNode;
}
void insertAtleft()
{
    int val, cnt = 0;
    printf("\nEnter the value to which the node should be inserted\n");
    scanf("%d", &val);
    temp1 = head;
    if (val == temp1->data)
    {
        insertAtBeginning();
        return;
    }

    while (cnt < count && temp1->data != val)
    {
        temp2 = temp1;
        temp1 = temp1->next;
        cnt++;
    }
    if (cnt == count)
    {
        printf("\nThe entered ele is not present\n");
        return;
    }
    create();
    temp->next = temp1;
    temp->prev = temp2;
    temp1->prev = temp;
    temp2->next = temp;
}
void insertAtright()
{
    int val, cnt = 0;
    printf("\nEnter the value to which the node should be inserted\n");
    scanf("%d", &val);
    while (cnt < count && temp1->data != val)
    {
        temp1 = temp1->next;
        cnt++;
    }
    if (cnt == count)
    {
        printf("\nThe entered ele is not present\n");
        return;
    }
    if (temp1->next != NULL)
    {
        create();
        temp->next = temp1->next;
        temp->prev = temp1;
        temp1->next->prev = temp;
        temp1->next = temp;
    }
    else
    {
        insertAtend();
        return;
    }
}
void deleteAtfirst()
{
    temp1 = head;
    if (head->next == NULL)
    {
        free(temp1);
    }
    else
    {
        temp1 = head;
        head = head->next;
        head->prev = NULL;
        free(temp1);
    }
}
void deleteAtlast()
{
    temp1 = head;
    if (head->next == NULL)
    {
        cout << temp1->data;
        free(temp1);
    }
    else
    {
        temp1 = head;
        while (temp1->next != NULL)
        {
            temp1 = temp1->next;
        }
        temp1->prev->next = NULL;
        delete temp1;
    }
}

void deleteAtdata()
{
    if (head == NULL)
    {
        cout << "Linked List is empty !" << endl;
        return;
    }
    int found = 0, key;
    cout << "enter the value to be deleted ";
    cin >> key;
    temp1 = head;
    temp2 = head;
    if (key == temp1->data)
    {
        deleteAtfirst();
        return;
    }

    while (temp1->next != NULL && temp1->data != key)
    {
        temp1 = temp1->next;
    }

    if (temp1->next == NULL)
    {
        if (key == temp1->data)
        {
            deleteAtlast();
            return;
        }
        else
        {
            cout << "Element not found in Linked List" << endl;
        }
    }
    else
    {
        temp1->prev->next = temp1->next;
        temp1->next->prev = temp1->prev;
    }
}
void reverse(){
    temp1=head;
    while(temp1 != NULL){
        temp2=temp1->prev;
        temp1->prev=temp1->next;
        temp1->next=temp2;
        temp1=temp1->prev;
    }
    head=temp2->prev;
}
int main()
{
    int choice;
    while (1)
    {
        printf("\nDoubly Linked list\n");
        printf("1.Insert at front of the list\n2.Insert at last of the list\n3.Insert at any position\n4.Inserting a node to left\n5.Inserting a node to right\n6.Deleting the node based on specific value\n7.Delete Node at first\n8.Delete a node at end\n9.Displaying all nodes in the list\n10.Reverse\n11.Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);
        switch (choice)
        {
        case 1:
            insertAtBeginning();
            break;
        case 2:
            insertAtend();
            break;
        case 3:
            insertpos();
            break;
        case 4:
            insertAtleft();
            break;
        case 5:
            insertAtright();
            break;
        case 6:
            deleteAtdata();
            break;
        case 7:
            deleteAtfirst();
            break;
        case 8:
            deleteAtlast();
            break;
        case 9:
            printList();
            break;
        case 10:
            reverse();
            break;
        case 11:
            exit(1);
            break;
        default:
            break;
        }
    }
}
