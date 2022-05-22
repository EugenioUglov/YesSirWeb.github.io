"# Yes Sir - Web" 

<p>The idea is to quickly search for information by a phrase, as it is done in a google search engine, and tags. When you enter a phrase that matches the title Action-Block, it is activated instantly.</p>

<h2>Algorithm</h2>
<p>When the user enters commands through a space into the search bar and clicks the find button -
the algorithm takes as input each set of characters (word) of the user and displays Action-Blocks on the page, which correspond to the input of the users. Tags are stored in an object, where the key is the tag and the value is an array of Action-Blocks indexes containing the tag. This approach makes it approximately one operation to find a tag - O(1).<br><br>

Let's imagine that we want to watch a cartoon whose name we forgot. But we know that there were animals. And it was specified in the tags on creating the Action-Block.<br><br>
<ul>
<li>User input:</li>
  Watch cool cartoon about animals
  <li>Search:</li>
  titles_by_tag ['watch'] = ['watch The Lion Guard', 'watch Harry Potter'] <br>
  titles_by_tag ['cartoon'] = ['watch The Lion Guard', 'Read inforamtion about Diney's cartoons'] <br>
  titles_by_tag ['about'] = ['Read inforamtion about Diney's cartoons'] <br>
  titles_by_tag ['cool'] = undefined <br>
  titles_by_tag ['animals'] = ['watch The Lion Guard'] <br>
  <li>Result:</li>
  Displaying Action-Blocks with the highest number of identical tags in priority: 'watch The Lion Guard', 'Read inforamtion about Diney's cartoons', 'watch Harry Potter'.
</ul>
<h2><b>Action-Blocks</b></h2>
The information that the user enters is contained in the Action-Block.
Action-Block object includes properties:
title, action, content, tags, imagePath.


<h2>Used technologies</h2>
Languages: JS, PHP, HTML, CSS. <br>
Design pattern: MVP. <br>
Libraries: Jquery. <br>
