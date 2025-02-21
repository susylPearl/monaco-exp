# **Monaco Editor Variable Highlighter**

## **Overview**  
This project integrates **Monaco Editor** to provide real-time syntax highlighting for specific variables using **regular expressions (RegEx)**. It enhances the editor experience by visually distinguishing variables, making it easier to read and edit code or text.

## **Features**  
- ✅ **Real-time Variable Highlighting** – Automatically highlights variables based on a given regex pattern.  
- ✅ **Custom Styling** – Variables are styled with inline decorations for better visibility.  
- ✅ **Cursor Positioning Fix** – Ensures the cursor is correctly placed after variable insertion.  
- ✅ **Dynamic Updates** – Live updates for new variables as the user types.  
- ✅ **Optimized Performance** – Uses `deltaDecorations` to efficiently update highlights without affecting the editor's performance.  

## **Technology Stack**  
- **Monaco Editor** – The core text editor  
- **React.js** – Frontend framework  
- **TypeScript** – Ensures type safety and maintainability  
- **Vercel** – Deployment platform  

## **Installation & Setup**  

### **1. Clone the Repository**  
```sh
git clone https://github.com/your-username/monaco-editor-highlighter.git
cd monaco-editor-highlighter
```
### **2. Install Dependencies**  
```sh
npm install
```
### **3. Start the Development Server**  
```sh
npm run dev
```
Your Monaco Editor will be available at http://localhost:3000.

## **How It Works**

#### **Text Processing**  
- The editor fetches the text input and runs a regex match for predefined variable patterns.  

#### **Highlighting Logic**  
- It calculates the range of each match and applies inline decorations.  

#### **Cursor Handling**  
- Prevents unwanted spacing issues and ensures the cursor is positioned correctly after inserting variables.  

#### **Efficient Rendering**  
- Uses `deltaDecorations` to update only modified sections, avoiding unnecessary re-renders.

## **Live Demo**  
[Try it Here](https://monaco-exp.vercel.app/)
