# Instagram Feed Integration - Debug Log

**Status:** ⚠️ DISABLED - Issues with image display and permalinks

**Last Updated:** 2026-01-11

## Problem Summary

Instagram feed integration partially works but has two critical issues:
1. **Black Images**: Images load successfully (no errors) but display as black boxes
2. **Wrong Permalinks**: Clicking posts goes to random Instagram reels, not the actual @dunzomedia posts

## What's Working ✅

- OAuth authentication flow
- Token exchange and storage in Supabase
- API successfully fetches 6 latest posts from @dunzomedia
- Media URLs (scontent CDN links) are valid and correct
- Captions display correctly
- Images "load" without errors (onLoad fires, no onError)
- Username (@dunzomedia) displays correctly

## What's NOT Working ❌

### Issue 1: Black Images
- Images report as "loaded successfully" in console
- `onLoad` event fires for all images
- But actual display shows black boxes
- Even with bg-red-500 background, boxes remain black (not red)
- Console shows: `Image loaded successfully for post [id]`

### Issue 2: Wrong Permalinks
- Instagram API returns permalinks like `https://www.instagram.com/reel/DBP23TNAtEC/`
- These permalinks go to random reels from other accounts, NOT @dunzomedia
- Media URLs (scontent) are correct and belong to @dunzomedia
- Attempted fix: construct permalinks from shortcode field
- **Fix not deployed yet** - shortcode field may not be available in API response

## Implementation Details

### Files Involved

**Components:**
- `/components/InstagramFeed.tsx` - Display component with horizontal scroll
- `/app/page.tsx` - Homepage (line 498-499, currently commented out)

**API Routes:**
- `/app/api/instagram/auth/route.ts` - Initiates OAuth flow
- `/app/api/instagram/callback/route.ts` - Handles OAuth callback, exchanges code for token
- `/app/api/instagram/feed/[clientId]/route.ts` - Fetches feed data from Instagram
- `/app/api/cron/refresh-instagram-tokens/route.ts` - Token refresh cron job

**Database:**
- Table: `instagram_tokens` (stores access tokens keyed by client_id UUID)
- Table: `web_clients` (maps slug 'danidiaz' to UUID)

### API Flow

1. User initiates OAuth: `GET /api/instagram/auth?client_id=danidiaz`
2. Redirects to Instagram with `scope=instagram_business_basic`
3. Callback: `GET /api/instagram/callback?code=...&state=danidiaz`
4. Exchange code for short-lived token (1 hour)
5. Store token in Supabase with client UUID
6. Frontend fetches: `GET /api/instagram/feed/danidiaz`
7. API makes 2-step Instagram request:
   - Step 1: `GET /v24.0/me?fields=user_id,username`
   - Step 2: `GET /v24.0/{user_id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,shortcode,timestamp&limit=6`
8. Transform data: VIDEO posts use `thumbnail_url`, IMAGE posts use `media_url`
9. Return to frontend

### Current Instagram API Configuration

- **API Version:** v24.0
- **Scope:** `instagram_business_basic`
- **Auth URL:** `https://www.instagram.com/oauth/authorize`
- **Token Exchange:** `POST https://api.instagram.com/oauth/access_token`
- **Graph API:** `https://graph.instagram.com/v24.0/...`
- **Fields Requested:** id, caption, media_type, media_url, thumbnail_url, permalink, shortcode, timestamp

## Debugging Attempts

### Attempt 1: CORS Issues
**Theory:** Images blocked by CORS policy
**Action:** Added `crossOrigin="anonymous"` and `referrerPolicy="no-referrer"` to img tags
**Result:** ❌ No change, images still black
**Rolled Back:** Yes, removed these attributes

### Attempt 2: Instagram CDN Hotlinking Protection
**Theory:** Instagram blocks embedding images from their CDN
**Action:** Tested CDN URLs directly in browser
**Result:** ✅ URLs work when opened directly
**Conclusion:** Not a hotlinking block

### Attempt 3: Image Proxy
**Theory:** Need to proxy images through our own server
**Action:** Not implemented yet
**Status:** Possible next step

### Attempt 4: Permalink Construction
**Theory:** Instagram API returns wrong permalinks
**Action:** Added `shortcode` to API fields, construct permalinks ourselves using pattern `/reel/{shortcode}` or `/p/{shortcode}`
**Code Location:** `/app/api/instagram/feed/[clientId]/route.ts` lines 130-139
**Result:** ⏳ Not confirmed - deployment issue, shortcode logs not appearing
**Status:** Needs verification if shortcode field exists in API response

### Attempt 5: CSS/Display Issues
**Theory:** Images loading but CSS hiding them
**Action:** Changed background from `bg-gray-800` to `bg-red-500`
**Result:** ❌ Boxes still black (not red), indicating images ARE rendering but incorrectly
**Conclusion:** Not a CSS issue, something wrong with image rendering itself

### Attempt 6: Image Dimension Logging
**Theory:** Images might be 0x0 pixels
**Action:** Added logging to show `naturalWidth` and `naturalHeight` in onLoad
**Code Location:** `/components/InstagramFeed.tsx` lines 145-149
**Result:** ⏳ Not confirmed - need to check console for dimension values
**Status:** Awaiting deployment

## Console Logging Added

### Server-Side (API Route)
```javascript
[Instagram Feed] Fetching feed for client slug: danidiaz
[Instagram Feed] Found client UUID: [uuid]
[Instagram Feed] Profile data: {user_id, username}
[Instagram Feed] Using user_id: [id] username: dunzomedia
[Instagram Feed] Expected username: dunzomedia
[Instagram Feed] === POST [n] RAW DATA ===
[Instagram Feed] id: [post_id]
[Instagram Feed] media_type: VIDEO/IMAGE
[Instagram Feed] media_url: https://scontent-...
[Instagram Feed] thumbnail_url: https://scontent-...
[Instagram Feed] shortcode: [code]
[Instagram Feed] permalink (from API): https://www.instagram.com/reel/...
[Instagram Feed] >>> CONSTRUCTED permalink: https://www.instagram.com/reel/[shortcode]/
```

### Client-Side (Component)
```javascript
[InstagramFeed Component] Fetching feed for clientId: danidiaz
[InstagramFeed Component] Received data: {username, posts}
[InstagramFeed Component] Number of posts: 6
[InstagramFeed Component] === POST [n] FULL DATA ===
[InstagramFeed Component] id: [post_id]
[InstagramFeed Component] media_type: VIDEO
[InstagramFeed Component] media_url: https://scontent-...
[InstagramFeed Component] permalink: https://www.instagram.com/...
[InstagramFeed Component] Rendering post [n]
[InstagramFeed Component] - img src: https://scontent-...
[InstagramFeed Component] - href (permalink): https://www.instagram.com/...
[InstagramFeed] Image loaded for post [id]
[InstagramFeed] Image dimensions: [width]x[height]
[InstagramFeed] Image src: https://scontent-...
```

## Known Console Output

From last test:
- ✅ All 6 posts fetching successfully
- ✅ Media URLs are valid scontent-iad3-*.cdninstagram.com links
- ✅ All images fire onLoad (not onError)
- ✅ Captions match @dunzomedia content
- ❌ Permalinks are wrong (random reels like `/reel/DBP23TNAtEC/`, `/reel/DBPvyEwjv_M/`)
- ❌ NO logs showing "shortcode:" field
- ❌ NO logs showing "CONSTRUCTED permalink:"
- ❌ NO logs showing "Image dimensions:"

**This suggests:** Latest code changes not deployed yet OR shortcode field doesn't exist in API response.

## Next Steps to Try

### Priority 1: Verify Shortcode Field
- Check if `shortcode` field is actually available in Instagram Platform API
- Instagram API docs: https://developers.facebook.com/docs/instagram-platform-api/reference/ig-media
- If not available, may need to parse post ID or use different approach

### Priority 2: Test Image Proxy
- Create `/api/instagram/image-proxy/[id]` route
- Fetch images server-side and stream to client
- This bypasses any Instagram CDN restrictions
- Update component to use `/api/instagram/image-proxy/{post.id}` instead of direct CDN URLs

### Priority 3: Investigate Permalink Issue
- If shortcode unavailable, try extracting from media_url or post ID
- Instagram post IDs can be decoded to shortcodes using base64 conversion
- Library: https://www.npmjs.com/package/instagram-id-to-url-segment
- Alternative: Just link to profile (`https://instagram.com/dunzomedia`) instead of individual posts

### Priority 4: Check Instagram API Permissions
- Verify `instagram_business_basic` scope includes media_url and permalink
- May need additional permissions: `instagram_content_publish` or `instagram_manage_insights`
- Check Meta Developer Console for scope requirements

### Priority 5: Alternative: Instagram Embed API
- Use Instagram's official oEmbed API instead
- Endpoint: `GET https://graph.facebook.com/v18.0/instagram_oembed?url={post_url}`
- Returns HTML embed code
- More reliable but less customizable

### Priority 6: Image Rendering Investigation
- Check if images are video thumbnails being served as wrong format
- Try adding `<video>` element for VIDEO type posts instead of `<img>`
- VIDEO posts use thumbnail_url which might not be standard image format

## Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
INSTAGRAM_APP_ID=your-instagram-app-id
INSTAGRAM_APP_SECRET=your-instagram-app-secret
```

## Testing Steps When Re-enabling

1. Uncomment InstagramFeed component in `/app/page.tsx` (line 499)
2. Ensure environment variables are set in production
3. Hard refresh browser (Ctrl+Shift+R)
4. Open DevTools Console
5. Look for logs listed in "Console Logging Added" section above
6. Verify:
   - Username shows "dunzomedia"
   - Media URLs are scontent-*.cdninstagram.com
   - Shortcode field is present
   - CONSTRUCTED permalink appears in logs
   - Image dimensions show actual values (not 0x0)
7. Visual inspection:
   - Background should be red if images not loading
   - Images should be visible if loading correctly
8. Click test:
   - Click on a post
   - Should go to correct @dunzomedia post/reel
   - NOT random other account's content

## References

- Instagram Platform API Docs: https://developers.facebook.com/docs/instagram-platform-api
- Instagram Basic Display API (deprecated): https://developers.facebook.com/docs/instagram-basic-display-api
- Meta Developer Console: https://developers.facebook.com/apps
- Supabase Dashboard: [Your Supabase project URL]

## Commit History

Key commits related to Instagram feed:
- Initial implementation of OAuth flow and feed fetching
- Added comprehensive logging throughout API and component
- Attempted CORS fixes (rolled back)
- Added permalink construction from shortcode
- Changed background color for debugging
- Disabled component on homepage

Use `git log --grep="Instagram" --oneline` to see full history.

---

**Note:** This feature is currently disabled on the homepage. To re-enable, uncomment lines 498-499 in `/app/page.tsx`.
