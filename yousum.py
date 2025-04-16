#!pip install yt_dlp
from yt_dlp import YoutubeDL
# Documentation Python de yt_dlp : https://github.com/yt-dlp/yt-dlp/blob/c54ddfba0f7d68034339426223d75373c5fc86df/yt_dlp/YoutubeDL.py#L457

#!pip install openai
from openai import OpenAI
# Open IA Dev plateform : https://platform.openai.com/docs/overview


def get_comments(video_url, max_comments, language):
  options = {"cookiefile":"cookies.txt", "getcomments": True, 'extractor_args': {'youtube': {'comment_sort': ['top'], 'max_comments': [str(max_comments),'all','all','5']}}}

  with YoutubeDL(options) as yt:
      info = yt.extract_info(video_url, download=False)
      comment_count = info["comment_count"]
      thumbnail = info["thumbnail"]
      comments_raw = info["comments"]
      if comments_raw == None or comment_count == 0:
        return None, 0, None
      comments = sorted(comments_raw, key=lambda x: x['like_count'], reverse=True) # Trie les commentaires du plus liké au moins liké
      title = info["title"]
      prompt_head = "The following comments are from the youtube video : " + title + "\nSynthesize these comments in three sentences maximum in the following language : " + language + '.'

      print('\n\nSynthèse des commentaires de la vidéo ' + title + ' :\n')
      return comments, comment_count, prompt_head

def min_by_key(key, dicts):
    return min(dicts, key=lambda d: d.get(key, 0))

def comments_filter(comments):
  comment_min_likes = min_by_key('like_count', comments) # Trouve le commentaire avec le moins de like
  min_likes = comment_min_likes['like_count']
  for comment in comments:
    comment_text = comment["text"]
    comment_lenght = len(comment_text)
    if comment_lenght > 1000:
      comments.remove(comment) # On supprime les commentaires trop longs pour contrôler le nombre maximum d'input token dépensés dans l'api d'OpenIA
    else:
      author = comment['author_is_uploader']
      favorite = comment['is_favorited']
      pinned = comment['is_pinned']
      if author == True or favorite == True or pinned == True:
        likes = comment['like_count']
        if likes < min_likes:
          comments.remove(comment) # Supprime le commentaire épinglé/favoris/de l'auteur s'il est moins populaire que le moins populaire des commentaires
  return comments

def print_comments(comments):
  prompt_comments = '\n'
  for comment in comments:
    text = comment['text']
    likes = str(comment['like_count'])
    time = comment['_time_text']
    prompt_comment = '\n' + text
    prompt_comments = prompt_comments + prompt_comment
  return prompt_comments

def comments_scraping(video_url, max_comments, language):
  comments, comment_count, prompt_head = get_comments(video_url, max_comments, language)
  if comment_count == 0:
    return None #Vidéo sans commentaire
  else:
    comments = comments_filter(comments) # Supprime les commentaires trop longs et ceux mis en avant par l'uploader de la vidéo qui ne font pas partis des plus populaires
    prompt_comments = print_comments(comments)
    prompt = prompt_head + prompt_comments
    return prompt

def gpt(prompt):
  client = OpenAI(api_key="paste-openai-api-key-here")

  completion = client.chat.completions.create(
    model="gpt-4o-mini",
    store=True,
    messages=[
      {"role": "user", "content": prompt}
    ]
  )

  result = completion.choices[0].message
  return result

def youtube_comments_summary():
  video_url = input('URL de la vidéo : ')

  max_comments = 20
  language = 'français'
  prompt = comments_scraping(video_url, max_comments, language)
  if prompt == None:
    print("Vidéo sans commentaire.")
  else:
    #print('\n\n' + prompt)
    result = gpt(prompt)
    summary = result.content
    print(summary)


youtube_comments_summary()
