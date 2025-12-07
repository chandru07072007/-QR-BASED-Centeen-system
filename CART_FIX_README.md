# Cart Issue Fix - User-Specific Cart Storage

## Problem
When a new user registered or logged in, they would see the previous user's cart items. All users were sharing the same cart because it was stored in `localStorage` with the same key `'cart'` for everyone.

## Solution
Modified the cart storage to be user-specific:

### Changes Made:

#### 1. **CartContext.js**
- Added `getCartKey()` helper function that returns user-specific cart key: `cart_${userId}`
- Cart now loads from user-specific localStorage key
- Added automatic cart reload when user switches (login/logout detection)
- Each user now has their own cart stored separately

#### 2. **AuthContext.js**
- Updated `logout()` function to clear the current user's specific cart
- Removes only the logged-out user's cart, not affecting other users

## How It Works

1. **User A logs in** → Cart stored as `cart_userA_id`
2. **User A adds items** → Items saved to `cart_userA_id`
3. **User A logs out** → `cart_userA_id` is cleared
4. **User B logs in** → Cart loaded from `cart_userB_id` (empty if new user)
5. **User B adds items** → Items saved to `cart_userB_id`
6. **User A logs in again** → Their previous cart is gone (cleared on logout)

## Testing Steps

1. **Test 1 - New User Has Empty Cart:**
   - Register a new user
   - Login with new user
   - Navigate to cart
   - ✅ Cart should be empty

2. **Test 2 - Different Users Have Different Carts:**
   - Login as User A
   - Add items to cart
   - Logout
   - Login as User B
   - ✅ Cart should be empty for User B
   - Add different items to cart
   - Logout
   - Login back as User A
   - ✅ User A's cart should be empty (cleared on logout)

3. **Test 3 - Cart Persists During Session:**
   - Login as a user
   - Add items to cart
   - Navigate to other pages (menu, home, etc.)
   - Return to cart
   - ✅ Cart items should still be there

## Technical Details

- **Storage Key Format:** `cart_${userId}` where userId comes from the logged-in user's `_id` or `id` field
- **Fallback Key:** If no user is logged in, uses generic `'cart'` key
- **Automatic Reload:** Cart automatically reloads every 500ms to detect user changes
- **Clean Logout:** User's cart is cleared from localStorage when they logout

## Files Modified
1. `/frontend/src/context/CartContext.js`
2. `/frontend/src/context/AuthContext.js`
