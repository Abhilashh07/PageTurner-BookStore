
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  emoji: string;
}

interface CartItem {
  book: Book;
  quantity: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  books: Book[] = [];
  categories: string[] = ['All'];
  searchText = '';
  selectedCategory = 'All';

  cart: CartItem[] = [];
  wishlist: Book[] = [];
  activeView = 'books';

  message = '';
  contactName = '';
  contactEmail = '';
  contactMessage = '';
  contactResponse = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.http.get<Book[]>('http://localhost:3000/api/books')
      .subscribe({
        next: data => {
          this.books = data;
          this.cdr.detectChanges();
        },
        error: () => {
          this.message = 'Could not load books. Check that the backend is running.';
          this.cdr.detectChanges();
        }
      });

    this.http.get<string[]>('http://localhost:3000/api/categories')
      .subscribe({
        next: data => {
          this.categories = data;
          this.cdr.detectChanges();
        }
      });

    this.loadSavedData();
  }

  get filteredBooks(): Book[] {
    const query = this.searchText.toLowerCase().trim();

    return this.books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        book.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  get cartCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  get cartTotal(): number {
    return this.cart.reduce(
      (sum, item) => sum + item.book.price * item.quantity, 0
    );
  }

  get wishlistCount(): number {
    return this.wishlist.length;
  }

  addToCart(book: Book): void {
    const existing = this.cart.find(item => item.book.id === book.id);

    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ book, quantity: 1 });
    }

    this.message = `${book.title} added to your cart!`;
    this.saveData();
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.saveData();
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeFromCart(item);
      return;
    }

    this.saveData();
  }

  removeFromCart(item: CartItem): void {
    this.cart = this.cart.filter(cartItem => cartItem.book.id !== item.book.id);
    this.saveData();
  }

  toggleWishlist(book: Book): void {
    const exists = this.wishlist.some(item => item.id === book.id);

    if (exists) {
      this.wishlist = this.wishlist.filter(item => item.id !== book.id);
      this.message = 'Removed from wishlist.';
    } else {
      this.wishlist.push(book);
      this.message = `${book.title} added to your wishlist!`;
    }

    this.saveData();
  }

  isWishlisted(book: Book): boolean {
    return this.wishlist.some(item => item.id === book.id);
  }

  showView(view: string): void {
    this.activeView = view;
    this.message = '';
  }

  checkout(): void {
    if (this.cart.length === 0) {
      this.message = 'Your cart is empty.';
      return;
    }

    this.message =
      `Demo order placed! Total: ₹${this.cartTotal.toFixed(2)}. No real payment was taken.`;

    this.cart = [];
    this.saveData();
  }

  private saveData(): void {
    try {
      localStorage.setItem('pageturner_cart', JSON.stringify(this.cart));
      localStorage.setItem('pageturner_wishlist', JSON.stringify(this.wishlist));
    } catch {
      this.message = 'Could not save your shopping data.';
    }
  }

  private loadSavedData(): void {
    try {
      const savedCart = localStorage.getItem('pageturner_cart');
      const savedWishlist = localStorage.getItem('pageturner_wishlist');

      if (savedCart) this.cart = JSON.parse(savedCart) as CartItem[];
      if (savedWishlist) this.wishlist = JSON.parse(savedWishlist) as Book[];
    } catch {
      this.cart = [];
      this.wishlist = [];
    }
  }

  sendMessage(): void {
    this.http.post<{ message: string }>(
      'http://localhost:3000/api/contact',
      {
        name: this.contactName,
        email: this.contactEmail,
        message: this.contactMessage
      }
    ).subscribe({
      next: response => {
        this.contactResponse = response.message;
        this.contactName = '';
        this.contactEmail = '';
        this.contactMessage = '';
      },
      error: () => {
        this.contactResponse = 'Unable to send message. Please try again.';
      }
    });
  }
}
