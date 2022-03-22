"# Fati Search Web" 

<p>The idea is to quickly search for information by a phrase, as it is done in a google search engine, and tags. When you enter a phrase that matches the title Action-Block, it is activated instantly.</p>

<h2>Algorithm</h2>
<p>When the user enters commands through a space into the search bar and clicks the find button -
the algorithm takes as input each set of characters (word) of the user and displays Action-Blocks on the page, which correspond to the input of the users. Tags are stored in an object, where the key is the tag and the value is an array of Action-Blocks indexes containing the tag. This approach makes it approximately one operation to find a tag - O(1).

<b>For instance:</b>
<ul>
<li>User input:</li>
  "Watch cartoon about animals".
  <li>Search:</li>
  Indexes_by_tag [‘watch’] = [3, 1] <br>
  Indexes_by_tag [‘cartoon’] = [3, 8] <br>
  Indexes_by_tag [‘about’] = undefined <br>
  Indexes_by_tag [‘animals’] = [1, 3, 259] <br>
  <li>Result:</li>
  Displaying Action-Blocks with the highest number of identical tags in priority. Displaying Action-Blocks with indexes in priority order: 3, 1, 8, 259.
</ul>
<h2><b>Action-Blocks</b></h2>
The information that the user enters is contained in the Action-Block.
Action-Block object:
{title:…, action:…., info: ...., tags: ..., imagePath: ...}


<h2>Used technologies</h2>
Languages: JS, HTML, CSS. <br>
Design pattern: MVP. <br>
Libraries: Jquery. <br>
