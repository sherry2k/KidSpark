# 🎮 KidSpark - Airtable CMS Setup Guide

This guide explains how to set up Airtable as your content management system so you can update game content without touching any code!

---

## 📋 Step 1: Create an Airtable Account

1. Go to [airtable.com](https://airtable.com) and sign up (free tier works!)
2. Create a new **Base** (workspace) called "KidSpark Content"

---

## 📊 Step 2: Create Tables

Create the following tables in your Airtable base. Each table needs specific columns:

### 🦁 Animals Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| id | Single line text | lion |
| name | Single line text | Lion |
| emoji | Single line text | 🦁 |
| funFact | Long text | Lions are called the King of the Jungle! |

### 🍎 Fruits Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| id | Single line text | apple |
| name | Single line text | Apple |
| emoji | Single line text | 🍎 |
| funFact | Long text | An apple a day keeps the doctor away! |
| color | Single line text | #ef4444 |

### 🥕 Vegetables Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| id | Single line text | carrot |
| name | Single line text | Carrot |
| emoji | Single line text | 🥕 |
| funFact | Long text | Carrots help you see better! |

### 🔺 Shapes Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| id | Single line text | circle |
| name | Single line text | Circle |
| emoji | Single line text | 🔴 |
| funFact | Long text | A circle has no corners! |

### 🌈 Colors Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| id | Single line text | red |
| name | Single line text | Red |
| emoji | Single line text | 🔴 |
| funFact | Long text | Fire trucks are red! |
| color | Single line text | #ef4444 |

### 🚗 Vehicles Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| id | Single line text | car |
| name | Single line text | Car |
| emoji | Single line text | 🚗 |
| funFact | Long text | Cars drive on roads! |

### 🦅 Birds Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| id | Single line text | eagle |
| name | Single line text | Eagle |
| emoji | Single line text | 🦅 |
| funFact | Long text | Eagles have amazing eyesight! |

### 🧠 BodyParts Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| id | Single line text | eyes |
| name | Single line text | Eyes |
| emoji | Single line text | 👀 |
| funFact | Long text | We see with our eyes! |

### 🔤 Alphabet Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| id | Single line text | a |
| name | Single line text | A - Apple |
| emoji | Single line text | 🍎 |
| funFact | Long text | A is the first letter! |

### 🔢 Numbers Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| id | Single line text | num-1 |
| name | Single line text | 1 |
| emoji | Single line text | 1️⃣ |
| funFact | Long text | Can you count 1 thing? |

### ❓ QuizQuestions Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| question | Single line text | Which animal is this? |
| emoji | Single line text | 🦁 |
| option1 | Single line text | Cat |
| option2 | Single line text | Lion |
| option3 | Single line text | Tiger |
| option4 | Single line text | Dog |
| correctAnswer | Number | 2 |
| category | Single line text | animals |

### 📝 WordBuilder Table
| Column Name | Field Type | Example |
|-------------|------------|---------|
| word | Single line text | CAT |
| emoji | Single line text | 🐱 |
| hint | Single line text | A furry pet that says meow |

---

## 🔑 Step 3: Get Your API Credentials

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **"Create new token"**
3. Give it a name like "KidSpark App"
4. Under **Scopes**, select:
   - `data.records:read`
   - `schema.bases:read`
5. Under **Access**, select your "KidSpark Content" base
6. Click **Create token**
7. Copy and save your **Personal Access Token** (starts with `pat...`)

### Get Your Base ID
1. Open your Airtable base
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. The part starting with `app` is your **Base ID**

---

## ⚙️ Step 4: Configure the App

Create a `.env` file in your project root:

```env
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

Or set these as environment variables in your hosting platform (Vercel, Netlify, etc.)

---

## 🔄 How It Works

1. **On app load**: The app checks if Airtable credentials are configured
2. **If configured**: Fetches all content from your Airtable tables
3. **If not configured**: Falls back to the built-in local data
4. **Fallback**: If any table is empty in Airtable, local data is used for that category

---

## ✨ Updating Content

Once set up, you can:

1. **Add new animals** → Just add a row to the Animals table
2. **Add quiz questions** → Add rows to QuizQuestions table
3. **Add words to spell** → Add rows to WordBuilder table
4. **Edit content** → Changes reflect immediately on next app load

No code changes or redeployment needed! 🎉

---

## 💡 Tips

- **Use consistent emoji** - Stick to standard emoji that display well on all devices
- **Keep fun facts short** - 1-2 sentences max for readability
- **Test on mobile** - Make sure emoji display correctly on phones
- **Backup your data** - Airtable has version history, but export occasionally

---

## 🚀 Advanced: Auto-Refresh

The app includes a `refreshContent()` function you can call to reload content without restarting the app. You could add a "refresh" button for admins or set up auto-refresh on a timer.

---

## 📱 Need Help?

- **Airtable Docs**: [airtable.com/developers](https://airtable.com/developers)
- **API Reference**: [airtable.com/developers/web/api](https://airtable.com/developers/web/api)
