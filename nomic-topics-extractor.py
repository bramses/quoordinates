from nomic import AtlasProject

map = AtlasProject(name="highlights").maps[0]

'''
             id            topic_depth_1            topic_depth_2                 topic_depth_3
0      41700088     Software Development  Habits and Goal Setting            Model-based design
1      41700089       Life and happiness  Habits and Goal Setting                  Goal Setting
2      41700090   Science and Technology                   Memory                        Action
3      41700091       Life and happiness        Negative emotions  Negative beliefs and sadness
4      41700147   Science and Technology                  Science                   Human error
...         ...                      ...                      ...                           ...
10167  41701259  Philosophy and religion     Evolutionary biology                  Human Nature
10168  41701260  Philosophy and religion     Evolutionary biology                  Human Nature
10169  41701261  Philosophy and religion     Evolutionary biology                      religion
10170  41701173  Philosophy and religion               philosophy                         Islam
10171  41701175  Philosophy and religion          Family and Work                     Education

[10172 rows x 4 columns]
'''



'''
df: pandas.DataFrame property
A pandas dataframe associating each datapoint on your map to their topics as each topic depth.
'''


df = map.topics.df

# extract topics from the map as a pandas df and put them into a set and then a list that is written to a file
topics = set()
for i in range(len(df)):
    topics.add(df['topic_depth_1'][i])
    topics.add(df['topic_depth_2'][i])
    topics.add(df['topic_depth_3'][i])

# remove topics from set that are empty strings or have (number) in them
'''
Writing
Writing (2)
Writing (3)

should be Writing only
'''
for topic in topics.copy():
    if topic == '' or topic[-1] == ')':
        topics.remove(topic)


topics = list(topics)
topics.sort()

with open('topics.txt', 'w') as f:
    for topic in topics:
        f.write(topic + '\n')

