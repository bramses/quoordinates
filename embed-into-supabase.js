import { createClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG,
  });
  
  const openai = new OpenAIApi(configuration);

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
})

const getEmbedding = async (text) => {
    const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: text,
      });

    return response.data.data[0].embedding
}


const highlightsExample = [
    {
        "user_book_id": 30388244,
        "title": "Proust and the Squid: The Story and Science of the Reading Brain",
        "author": "Maryanne Wolf",
        "readable_title": "Proust and the Squid",
        "source": "kindle",
        "cover_image_url": "https://images-na.ssl-images-amazon.com/images/I/5116mfAq0YL._SL75_.jpg",
        "unique_url": null,
        "book_tags": [],
        "category": "books",
        "document_note": null,
        "readwise_url": "https://readwise.io/bookreview/30388244",
        "source_url": null,
        "asin": "B00NLL4PFG",
        "highlights": [
            {
                "id": 568359006,
                "text": "It is said that Machiavelli would sometimes prepare to read by dressing up in the period of the writer he was reading and then setting a table for the two of them. This was his sign of respect for the author\u2019s gift, and perhaps of Machiavelli\u2019s tacit understanding of the sense of encounter that Proust described. While reading, we can leave our own consciousness, and pass over into the consciousness of another person, another age, another culture. \u201cPassing over,\u201d a term used by the theologian John Dunne, describes the process through which reading enables us to try on, identify with, and ultimately enter for a brief time the wholly different perspective of another person\u2019s consciousness. When we pass over into how a knight thinks, how a slave feels, how a heroine behaves, and how an evildoer can regret or deny wrongdoing, we never come back quite the same; sometimes we\u2019re inspired, sometimes saddened, but we are always enriched. Through this exposure we learn both the commonality and the uniqueness of our own thoughts\u2014that we are individuals, but not alone.",
                "location": 399,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:54.692Z",
                "updated_at": "2023-07-24T01:01:54.692Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388244,
                "tags": [
                    {
                        "id": 133385361,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568359006"
            },
            {
                "id": 568359007,
                "text": "Children with a rich repertoire of words and their associations will experience any text or any conversation in ways that are substantively different from children who do not have the same stored words and concepts.",
                "location": 426,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:54.692Z",
                "updated_at": "2023-07-24T01:01:54.692Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388244,
                "tags": [
                    {
                        "id": 133385362,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568359007"
            },
            {
                "id": 568359008,
                "text": "Unlike its component parts such as vision and speech, which are genetically organized, reading has no direct genetic program passing it on to future generations. Thus the next four layers involved must learn how to form the necessary pathways anew every time reading is acquired by an individual brain. This is part of what makes reading\u2014and any cultural invention\u2014different from other processes, and why it does not come as naturally to our children as vision or spoken language, which are preprogrammed.",
                "location": 456,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:54.692Z",
                "updated_at": "2023-07-24T01:01:54.692Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388244,
                "tags": [
                    {
                        "id": 133385364,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568359008"
            },
            {
                "id": 568359009,
                "text": "The French neuroscientist Stanislas Dehaene tells us that the first humans who invented writing and numeracy were able to do this by what he calls \u201cneuronal recycling.\u201d",
                "location": 462,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:54.692Z",
                "updated_at": "2023-07-24T01:01:54.692Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388244,
                "tags": [
                    {
                        "id": 133385365,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568359009"
            },
            {
                "id": 568605948,
                "text": "By using indirect approaches, Proust and Monet force their readers and viewers to contribute actively to the constructions themselves, and in the process to experience them more directly. Reading is a neuronally and intellectually circuitous act, enriched as much by the unpredictable indirections of a reader\u2019s inferences and thoughts, as by the direct message to the eye from the text.",
                "location": 522,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-24T04:56:00Z",
                "created_at": "2023-07-24T14:15:30.552Z",
                "updated_at": "2023-07-24T14:15:30.552Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388244,
                "tags": [
                    {
                        "id": 133431947,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568605948"
            },
            {
                "id": 568605949,
                "text": "One hundred fifty years ago Charles Darwin saw in creation a similar principle, whereby \u201cendless\u201d forms evolve from finite principles: \u201cFrom so simple a beginning, endless forms most beautiful and most wonderful have been, and are being evolved.\u201d So it is with written language. Biologically and intellectually, reading allows the species to go \u201cbeyond the information given\u201d to create endless thoughts most beautiful and wonderful. We must not lose this essential quality in our present moment of historical transition to new ways of acquiring, processing, and comprehending information.",
                "location": 535,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-24T04:56:00Z",
                "created_at": "2023-07-24T14:15:30.552Z",
                "updated_at": "2023-07-24T14:15:30.552Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388244,
                "tags": [
                    {
                        "id": 133431948,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568605949"
            },
            {
                "id": 568605950,
                "text": "Proust\u2019s understanding of the generative nature of reading contains a paradox: the goal of reading is to go beyond the author\u2019s ideas to thoughts that are increasingly autonomous, transformative, and ultimately independent of the written text. From the child\u2019s first, halting attempts to decipher letters, the experience of reading is not so much an end in itself as it is our best vehicle to a transformed mind, and, literally and figuratively, to a changed brain.",
                "location": 554,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-24T04:56:00Z",
                "created_at": "2023-07-24T14:15:30.552Z",
                "updated_at": "2023-07-24T14:15:30.552Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388244,
                "tags": [
                    {
                        "id": 133431949,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568605950"
            },
            {
                "id": 568605951,
                "text": "We will begin in Sumer, Egypt, and Crete, where the still mysterious beginnings of written language can be found among Sumerian cuneiform, Egyptian hieroglyphs, and some recently discovered proto-alphabetic scripts. Each major type of writing invented by our ancestors demanded something a little different from the brain, and this may explain why more than 2,000 years elapsed between these earliest known writing systems and the remarkable, almost perfect alphabet developed by the ancient Greeks. At its root the alphabetic principle represents the profound insight that each word in spoken language consists of a finite group of individual sounds that can be represented by a finite group of individual letters. This seemingly innocent-sounding principle was totally revolutionary when it emerged over time, for it created the capacity for every spoken word in every language to be translated into writing.",
                "location": 564,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-24T04:56:00Z",
                "created_at": "2023-07-24T14:15:30.552Z",
                "updated_at": "2023-07-24T14:15:30.552Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388244,
                "tags": [
                    {
                        "id": 133431950,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568605951"
            },
            {
                "id": 568605952,
                "text": "Why Socrates directed all his legendary rhetorical skills against the Greek alphabet and the acquisition of literacy is one of the great, largely untold stories in the history of reading. In words unerringly prescient today, Socrates described what would be lost to human beings in the transition from oral to written culture. Socrates\u2019 protests\u2014and the silent rebellion of Plato as he recorded every word\u2014are notably relevant today as we and our children negotiate our own transition from a written culture to one that is increasingly driven by visual images and massive streams of digital information.",
                "location": 570,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-24T04:56:00Z",
                "created_at": "2023-07-24T14:15:30.552Z",
                "updated_at": "2023-07-24T14:15:30.552Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388244,
                "tags": [
                    {
                        "id": 133431951,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568605952"
            }
        ]
    },
    {
        "user_book_id": 30388241,
        "title": "The Real World of Technology (CBC Massey Lectures)",
        "author": "Ursula Franklin",
        "readable_title": "The Real World of Technology",
        "source": "kindle",
        "cover_image_url": "https://images-na.ssl-images-amazon.com/images/I/51Y3TW0sYqL._SL75_.jpg",
        "unique_url": null,
        "book_tags": [],
        "category": "books",
        "document_note": null,
        "readwise_url": "https://readwise.io/bookreview/30388241",
        "source_url": null,
        "asin": "B00KTJ4K3U",
        "highlights": [
            {
                "id": 568358968,
                "text": "Over and above this, we live with what I call constructed or reconstructed reality. Its manifestations range from what comes to us through works of fiction to the daily barrage of advertising and propaganda. It encompasses descriptions and interpretations of those situations that are considered archetypal rather than representative. These descriptions furnish us with patterns of behaviour. We consider these patterns real, even if we know the situations have been constructed in order to make a particular pattern very clear and evident. So when we read Dostoyevsky, we know that the Grand Inquisitor is not just an episode in Russian history, it\u2019s a pattern of inquisition, the prototype of what happens to the powerless in front of the powerful all over the world. Every Christmas, Dickens\u201d Scrooge is paraded as the archetype of grumpy selfishness. The constructed or reconstructed realities are part of the fabric that holds the common culture together. They become so much a part of the vernacular reality that a newcomer confronts with puzzlement references that just cannot be figured out. This happened to me a great deal when I first came to Canada, and it is as awkward as hearing people laugh at a joke and not understanding what is funny about it.",
                "location": 403,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385332,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358968"
            },
            {
                "id": 568358969,
                "text": "With respect to the relationship between science and technology, it has often been assumed that science is a prerequisite for technology. I\u2019m not sure whether this has ever strictly been true. Certainly in seventeenth- and eighteenth-century western Europe science did stimulate a large number of technologies. However, today there is no hierarchical relationship between science and technology. Science is not the mother of technology. Science and technology today have parallel or side-by-side relationships; they stimulate and utilize each other. It is more appropriate to regard science and technology as one enterprise with a spectrum of interconnected activity than to think of two fields of endeavour \u2014 science as one, and applied science and technology as the other. Thus when I speak of modern science and technology, I mean this unit of enterprise until I specify other constraints. In spite of what I\u2019ve just said I want to speak for a moment about the scientific method. Science as well as technology is, after all, more than just a body of knowledge; it is a set of practices and methods. The scientific method as we understand it in the West is a way of separating knowledge from experience. It is the strength of the scientific method that it provides a way to derive the general from the particular and then, in turn, allows general rules and laws to be applied to particular questions. Consequently, somebody can today go to a university and learn how to build bridges from somebody who has never built a bridge.",
                "location": 418,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385333,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358969"
            },
            {
                "id": 568358970,
                "text": "The scientific method works best in circumstances in which the system studied can be truly isolated from its general context. This is why its first triumphs came in the study of astronomy.",
                "location": 429,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385334,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358970"
            },
            {
                "id": 568358971,
                "text": "In terms of the realities that we have discussed, the message-transmission technologies have created a host of pseudorealities based on images that are constructed, staged, selected, and instantaneously transmitted. I\u2019m talking here about the world of radio, television, film, and video. The images create new realities with intense emotional components. In the spectators they induce a sense of \u201cbeing there,\u201d of being in some sense a participant rather than an observer. There is a powerful illusion of presence in places and on occasions where the spectators, in fact, are not and have never been. Edward R. Murrow\u2019s phrase, \u201cYou are there,\u201d led his audience to believe that they were somehow \u201cpresent\u201d at important international events. In French the news is called les actualites, although there is very little that is actual and real in the images and the stories that we see and hear. The technological process of image-making and image transformation is a very selective one. It creates for the eye and ear a \u201crendition\u201d rather than an \u201cactualite.\u201c Yet for people all around the world the image of what is going on, of what is important, is primarily shaped by the pseudorealities of images. The selective fragments that become a story on radio and television are chosen to highlight particular events.",
                "location": 469,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385335,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358971"
            },
            {
                "id": 568358972,
                "text": "If I want to promote change I need to understand and appreciate the structuring of the images, even if I don\u2019t trust their content. Opting out by individuals really doesn\u2019t change the agenda of what is urgent and what is not, unless there is a collective effort to supplement and substitute the images with genuine experience. Just because the imaging technology has emphasized the far over the near, the near doesn\u2019t go away. Even though the abnormal is given a great deal more play than the normal, the normal still exists and, with it, all its problems and challenges. But somehow observing a homeless person sleeping in the park around the corner doesn\u2019t seem to register as an event when it\u2019s crowded out in the observer\u2019s mind by images from far-away places.",
                "location": 512,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385336,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358972"
            },
            {
                "id": 568358973,
                "text": "The strong impact of the world of images on people\u2019s reality has yet another component. Viewing or listening to television, radio, or videos is shared experience carried out in private. The printing technologies were the first ones that allowed people to take in separately the same information and then discuss it together. Prior to that, people who wanted to share an experience had to be together in the same place \u2014 to see a pageant, to listen to a speech. Then, printed text \u2014 quoted and requoted \u2014 yielded some of the common information. Now there are new, high-impact technologies and these produce largely ephemeral images. The images create a pseudocommunity, the community of those who have seen and heard what they perceive to be the same event that others, who happened not to have watched or listened, missed for good. Just listen to a discussion of a hockey game \u2014 or, for that matter, to a discussion of a leader\u2019s debate \u2014 that no one present attended. The talk proceeds as if all had been there. In this manner, pseudorealities create pseudocommunities.",
                "location": 524,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385338,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358973"
            },
            {
                "id": 568358974,
                "text": "And now I\u2019d like to focus for a moment on the human consequences which are particularly evident in what are called the communications technologies, and which I would like to call the \u201cnon-communications\u201d technologies because very often that word, \u201ccommunication,\u201d is a misnomer. Whenever human activities incorporate machines or rigidly prescribed procedures, the modes of human interaction change. In general, technical arrangements reduce or eliminate reciprocity. Reciprocity is some manner of interactive give and take, a genuine communication among interacting parties. For example, a face-to-face discussion or a transaction between people needs to be started, carried out, and terminated with a certain amount of reciprocity. Once technical devices are interposed, they allow a physical distance between the parties. The give and take \u2014 that is, the reciprocity \u2014 is distorted, reduced, or even eliminated.",
                "location": 561,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385337,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358974"
            },
            {
                "id": 568358975,
                "text": "Shifts of power and control are going on all the time. These processes are complex and interactive. Technologies, as I have stressed throughout these lectures, exist in particular contexts, and these contexts are usually fluid and changeable. Within a given context, the relationship between tool and task is of fundamental importance. Historians have often pointed out that when special tools become available to carry out particular tasks the success of these tasks will, by necessity, encourage the further use of the tools, which may then be improved and adapted to other tasks. But the success and spread of a particular tool \u2014 and this tool can be organizational or administrative as well as mechanical \u2014 has another consequence. Any task tends to be structured by the available tools. It can appear that the available tools represent the best or even the only way to deal with a situation. This happens every day. If you have a particular type of kitchen equipment, you begin to slice and dice as you have never done before. Other means of food preparation become less attractive and you may eventually forget about them. If your lab gets an electron microscope, you will find it difficult to persuade students to use optical microscopy. Tools often redefine a problem. Think, for instance, of speeding and radar traps. Let\u2019s go back to the purpose of speed limits. They were instituted to enhance safety, not to produce criminality. One way of enforcing speed limits used to be the judicious presence of clearly marked police cruisers on our highways. The police drove at the speed limit and by this tactic brought the traffic pattern into compliance with the regulations. The tool of radar traps brought another dimension into the situation. The emphasis shifted from common safety to individual \u201cdeterrence.\u201d It was felt that the fear of being caught and fined would be a better way of enforcing the regulations. Next came a technological option of avoiding the radar trap, using what\u2019s commonly called a \u201cfuzz-buster.\u201d Now the motorist, concerned less with safety than with criminality, buys an avoidance device, whether it is outlawed or not. The next player in the speeding game is a device for law-enforcement officers to detect the presence of a fuzz-buster. And now there seems to be a new generation of widget on the horizon which those with a fuzz-buster can use to detect the counter-technology of law enforcement. And so it goes.",
                "location": 629,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385340,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358975"
            },
            {
                "id": 568358976,
                "text": "The real world of technology is a very complex system. And nothing in my survey or its highlights should be interpreted as technological determinism or as a belief in the autonomy of technology per se. What needs to be emphasized is that technologies are developed and used within a particular social, economic, and political context.1 They arise out of a social structure, they are grafted on to it, and they may reinforce it or destroy it, often in ways that are neither foreseen nor foreseeable. In this complex world neither the option that \u201ceverything is possible\u201d nor the option that \u201ceverything is preordained\u201d exists.",
                "location": 650,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385341,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358976"
            },
            {
                "id": 568358977,
                "text": "Personally, I much prefer to think in terms not of systems but of a web of interactions. This allows me to see how stresses on one thread affect all others. The image also acknowledges the inherent strength of a web and recognizes the existence of patterns and designs. Anyone who has ever woven or knitted knows that one can change patterns, but only at particular points and only in a particular way so as not to destroy the fabric itself. When women writers speak about reweaving the web of life,5 they mean exactly this kind of pattern change. Not only do they know that such changes can be achieved but, more importantly, they know there are other patterns. The web of technology can indeed be woven differently, but even to discuss such intentional changes of pattern requires an examination of the features of the current pattern and an understanding of the origins and the purpose of the present design.",
                "location": 661,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385342,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358977"
            },
            {
                "id": 568358978,
                "text": "Foucault recounts how French towns were managed during the Plague \u2014 how the city areas were sub-divided, how all were centrally controlled, and how total discipline was enforced by threat of execution. In a milder vein, he shows designs for compliance embedded in the architecture of prisons, hospitals, and training schools. Their structural arrangements were later incorporated into the designs of factories. It was into this socially and politically well prepared soil that the seeds of the Industrial Revolution fell. The factory system, with its mechanical devices and machines, only augmented the patterns of control. The machinery did not create them. The new patterns, with their minute description of detail, their divisions of labour, and their breakdown of processes into small prescriptive steps, extended quickly from manufacturing into commercial, administrative, and political areas. In England and in France, changes quickly occurred in institutions as diverse as banks and prisons. Planning thrived as an activity closely and intimately associated with the exercise of control. In Britain, the Industrial Revolution led to developments similar to those described by Foucault. They were considerably accelerated when machines entered into the workplace. To plan with and for technology became the Industrial Revolution\u2019s strongest dream. The totally automated factory \u2014 that is, a factory completely without workers \u2014 was discussed by Babbage and his contemporaries in the early nineteenth century.7 It took, though, another two hundred years of technical development and the creation of new infrastructures to make such schemes a practical feature of the real world of technology.",
                "location": 691,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.242Z",
                "updated_at": "2023-07-24T01:01:53.242Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385343,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358978"
            },
            {
                "id": 568358979,
                "text": "There is another commonality between our time and the period of the Industrial Revolution: Both ages had irrationally high expectations of the beneficial effects of science and technology voiced by their respective proponents. Machines \u2014 or today, electronic devices \u2014 were soon to overcome the physical and mental shortcomings of mere humans. Machines, after all, did not drink; they did not require moral guidance of the kind Victorians lavished on the working class. Today\u2019s banking machines do not belong to a union or need maternity leave \u2014 although even the most clever computers can catch amazing viruses. There was, however, one noticeable blind spot in the contemporary considerations of mechanization during the Industrial Revolution that is not part of the repertoire of modern technological expansionists. The proponents of technology in the 1840s were very enthusiastic about replacing workers with machines. But somehow I find no indication that they realized that while production could be carried out with few workers and still run to high outputs, buyers would be needed for these outputs. The realization that though the need for workers decreased, the need for purchasers could increase, did not seem to be part of the discourse on the machinery question. Since then, however, technology and its promoters have had to create a social institution \u2014 the consumer \u2014 in order to deal with the increasingly tricky problem that machines can produce, but it is usually people who consume.",
                "location": 748,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385339,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358979"
            },
            {
                "id": 568358980,
                "text": "The argument that I would like to put before you is the following: Since the time of the Industrial Revolution, the growth and development of technology has required as a necessary prerequisite a support relationship from governments and public institutions that did not exist in earlier times. Here one wants to consider in the first place the technologies of transport \u2014 moving raw materials and final products along the road, rail, air, and water, as well as moving energy and information from points of generation to points of use. Such distribution systems and their technologies link the so-called private spheres of industry and commerce to the public spheres of local and central governments. In order to operate successfully, the industrial production technologies require permanent transportation and distribution structures. In all countries the public sphere has supplied these infrastructures and has adjusted itself accordingly. Arranging to provide such infrastructures has become a normal and legitimate function of all governments. The infrastructures for the distribution of electricity are a case in point. As a commodity, electricity has to be generated more or less continually and it cannot be stored in the way coal or coke can be piled up. Furthermore, those products of industry that need electricity to work can only be sold and used where dependable supplies of electricity are at hand. Thus, when electrical technologies entered the scene, planning and providing for industry became an increasingly important part of the activities of governments. These were activities for the development and expansion of technological enterprises, although in terms of public policy they have always been interpreted as public activities in the public interest.",
                "location": 771,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385344,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358980"
            },
            {
                "id": 568358981,
                "text": "One of the reasons I emphasize the link between public policies related to the provision of infrastructures and the spread of technology is the following: Rarely are there public discussions about the merits or problems of adopting a particular technology. For example, Canadians have never been asked (for instance, through a bill before the House of Commons) whether they are prepared to spend their taxes to develop, manufacture, and market nuclear reactors. Yet without publicly funded research and development, industrial support and promotion, and government loans to purchasers, Canadian nuclear technology would not exist. The political systems in most of today\u2019s real world of technology are not structured to allow public debate and public input at the point of planning technological enterprises of national scope. And it is public planning that is at issue here. Regardless of who might own railways or transmission lines, radio frequencies or satellites, the public sphere provides the space, the permission, the regulation, and the finances for much of the research. It is the public sphere that grants the \u201cright of way.\u201d It seems to be high time that we, as citizens, become concerned about the granting of such technological rights of way.",
                "location": 804,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385354,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358981"
            },
            {
                "id": 568358982,
                "text": "If you have a garden and your friends help you to grow a tremendous tomato crop, you can share it out among those who helped. What you have obtained is a divisible benefit and the right to distribute it. Whoever didn\u2019t help you, may not get anything. On the other hand, if you work hard to fight pollution and you and your friends succeed in changing the practices of the battery-recycling plant down the street, those who helped you get the benefits, but those who didn\u2019t get them too. What you and your friends have obtained are indivisible benefits.",
                "location": 822,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385355,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358982"
            },
            {
                "id": 568358983,
                "text": "Normally one considers it the obligation of governments, whose institutions are funded through a taxation system, to attend to those aspects of society that provide indivisible benefits \u2014 justice and peace, as well as clean air, sanitation, drinkable water, safe roads, equal access to education; public institutions, from courts and schools to regulatory and enforcement systems, developed to do these public tasks. In other words, there is historically the notion that citizens surrendered some of their individual autonomy (and some of their money) to the state for the protection and advancement of the \u201ccommon good\u201d \u2014 that is, indivisible benefits.",
                "location": 826,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385345,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358983"
            },
            {
                "id": 568358984,
                "text": "Technology has changed this notion about the obligations of a government to its citizens. The public infrastructures that made the development and spread of technology possible have become more and more frequently roads to divisible benefits. Thus the public purse has provided the wherewithal from which the private sector derives the divisible benefits, while at the same time the realm from which the indivisible benefits are derived has deteriorated and often remains unprotected.",
                "location": 831,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385347,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358984"
            },
            {
                "id": 568358985,
                "text": "I stressed before that many of the political decisions related to the advancement of technology and the provision of appropriate infrastructures are made on a technical level, far away from public scrutiny. But these decisions do incorporate political biases and political priorities which, in a technical setting, need not be articulated. As far as the public is concerned, the nature of the decision, and its often hidden political agenda, becomes evident only when the plans and designs are executed and in use. Of course, at this point change becomes almost impossible.",
                "location": 840,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385353,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358985"
            },
            {
                "id": 568358986,
                "text": "In these lectures I have emphasized the difference between holistic and prescriptive technologies because I feel it is important to understand the ways in which prescriptive technologies fragment work. When a task that used to be done by one person is divided into subtasks for a number of people, some basic social parameters change. I said in the first lecture that putting people into a prescriptive mode of work where they have no latitude for judgement and decision-making acculturates them to external control, authority, and conformity. Prescriptive technologies are a seed-bed for a culture of compliance. I have also tried to show how our sense of reality has been changed, especially by the kinds of communications technologies that are based on long-distance information transfer. I introduced the concept of reciprocity to distinguish between the one-way communications so common today and those human interactions based on a give-and-take model. In the last lecture I showed that since the time of the Industrial Revolution public planning and public resources have provided the infrastructures necessary for the expansion of new technologies and for the diffusion and use of the products of the new industries. This development forged increasingly close linkages between governments and technological growth and development. Our lives today are affected by these linkages. The planning processes which have fostered the development and spread of technology have provided infrastructures that we now consider as a given, normal, and unquestionable part of the real world. Not being mindful of how these structures arose can hamper attempts to change them or to replace old arrangements with new and more appropriate ones. Today these infrastructures go well beyond road, rail, airport, and power grids; they include financial and tax structures, information networks, and government sponsored research and development on behalf of technological advancement. All these infrastructures could have been designed differently if the first design priority had been human development rather than technological development.",
                "location": 860,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385356,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358986"
            },
            {
                "id": 568358987,
                "text": "Many technological systems, when examined for context and overall design, are basically anti-people. People are seen as sources of problems while technology is seen as a source of solutions.",
                "location": 875,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385357,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358987"
            },
            {
                "id": 568358988,
                "text": "once a country has embarked on developing an arms production system, it falls upon the government to provide the wherewithal over a long period of time. The development of a weapons system, from design to deployment, may take ten years or more. To keep such technological activities going, public funds have to be committed and expended. To keep the public funds flowing, justifications are needed. And this generates the need for a credible long-term enemy.",
                "location": 902,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385358,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358988"
            },
            {
                "id": 568358989,
                "text": "In the real world of technology, there are then two tasks for the state, if governments wish to use arms production as an infrastructure for the advancement of technology: the state has to guarantee the flow of money, and the state has to guarantee the ongoing, long-term presence of a credible enemy, because only a credible enemy justifies the massive outlay of public funds. The enemy must warrant the development of the most advanced technological devices. The enemy must be cunning, threatening, and just barely beatable by truly ingenious and heroic technologies.",
                "location": 905,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385359,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358989"
            },
            {
                "id": 568358990,
                "text": "Before leaving the subject, I want to point out the changes that technology has brought to the part of citizens in war preparation and warfare. Just as fewer and fewer unskilled workers are needed in a modern technological production system, a country now has little practical need for raw recruits to operate its modern technological destruction system. Abandoning compulsory military service is not so much a sign of peaceful intentions as it is a sign of galloping automation. But the old pacifist dream that there might be a war and nobody would come and consequently the war could not take place, is no longer valid. Wars can be started without calling on any additional people. Military service from citizens is no longer a prerequisite for war. What is a prerequisite is the compulsory financial service of all citizens, well before any military exchange begins. Thus the pacifist\u2019s motto \u201cWe Won\u2019t Fight,\u201d must be translated into a new slogan: \u201cWe won\u2019t pay for the preparations for war and organized violence.\u201d This, of course, is the position of Canadians who pay their full income tax but insist on redirecting a portion of it to a peace tax fund so it cannot be used for the war-building purposes I have described.",
                "location": 934,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385360,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358990"
            },
            {
                "id": 568358991,
                "text": "Even within one plan, there are often contradictory goals. When I was actively involved with the Toronto Planning Board, I wrote a paper called The Resource Base and the Habitat. I wanted to point out that large modern cities fulfill two internally contradictory functions. Cities have become the natural habitat for many people; it is in cities that most people grow up, spend essentially all their lives, and bring up their families. Planning is supposed to assure that the city remains a liveable, safe, and sane habitat. But large population concentrations in cities also present a resource base for many enterprises. The need for food and shelter, for entertainment and employment, make cities a resource base like mines or forests. Those who want to exploit the resource base have different planning goals from those who need to develop and maintain the habitat. The resource-base users press for unrestricted access to the resource, and as little responsibility as possible for the debris and residue left by the exploitation of the resource. The garbage heaps of the shopping centres or the plastic containers from the fastfood emporia become the equivalent of a mine\u2019s tailing dump and lagoons, left for the community to dispose of.",
                "location": 954,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385363,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358991"
            },
            {
                "id": 568358992,
                "text": "Let me recap again. I have pointed to planning as an activity involving planners and plannees. Planning, in my sense of the word, originated with prescriptive technologies. As prescriptive technologies have taken over most of the activities in the real world of technology, planning has become society\u2019s major tool for structuring and restructuring, for stating what is doable and what is not. The effects of lives being planned and controlled are very evident in people\u2019s individual reactions to the impingement of planning on them. The real world of technology is full of ingenious individual attempts to sabotage externally imposed plans. As a social phenomenon, such avoidance techniques are well worth studying. A common denominator of technological planning has always been the wish to adjust parameters to maximize efficiency and effectiveness. Underlying the plans has been a production model, and production is typically planned to maximize gain. In such a milieu it is easy to forget that not everything is plannable. Actually, most things are properly described by a growth model \u2014 and that means many activities of living \u2014 and are ultimately not plannable. A quick example from my own experience: Although I was intellectually quite well prepared for the birth of my first child, I was stunned by the degree of randomness that this event created in my life. It took me a while to understand that it was pointless to plan my days the way I used to. This did not mean that I didn\u2019t plan or prearrange, but that I needed different schemes to deal with the unplannable. Women in particular have developed such schemes over the centuries \u2014 arrangements that are not a surrender to randomness, but an allotment of time and resources based on situational judgements, quite akin to what I described earlier as the characteristics of holistic technologies. Such schemes require knowledge, experience, discernment, and an overview of a given situation. These schemes are different in kind from those of prescriptive planning. What makes them so different is that holistic strategies are, more often than not, intended to minimize disaster rather than to maximize gain.",
                "location": 965,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385366,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358992"
            },
            {
                "id": 568358993,
                "text": "Berit As, the well-known Norwegian sociologist and feminist, has described this difference in strategies. She sees traditional planning as part of the strategy of maximizing gain, and coping as central to schemes for minimizing disaster.6 A crucial distinction here is the place of context. Attempts to minimize disaster require recognition and a profound understanding of context. Context is not considered as stable and invariant; on the contrary, every response induces a counter-response which changes the situation so that the next steps and decisions are taken within an altered context. Traditional planning, on the other hand, assumes a stable context and predictable responses. Planning\u2026",
                "location": 980,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385367,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358993"
            },
            {
                "id": 568358994,
                "text": "The study, Canada as a Conserver Society, by the Science Council of Canada, is an example in a slightly different vein. In 1975 a Science Council committee, which I chaired, was asked to explore whether and how Canada could become a conserver society. The council\u2019s final report described the concept of a conserver society as follows: The concept of a conserver society arises from a deep concern for the future, and the realization that decisions taken today, in such areas as energy and resources, may have irreversible and possibly destructive impacts in the medium to long term. The necessity for a conserver society follows from our perception of the world as a finite host to humanity and from our recognition of increasing global independence.",
                "location": 1003,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385368,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358994"
            },
            {
                "id": 568358995,
                "text": "The common theme that runs through many disasterminimizing endeavours is the conviction that ordinary people matter \u2014 in the way Schumacher meant when he called his book Small Is Beautiful; Economics as if People Mattered. But we must remember that, in the real world of technology, most people live and work under conditions that are not structured for their well-being. The environment in which we live is much more structured for the well-being of technology. It is a manufactured and artificially constructed environment, not what one might call a natural environment. While our surroundings may be a milieu conducive to production, they are much less a milieu conducive to growth.",
                "location": 1018,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385369,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358995"
            },
            {
                "id": 568358996,
                "text": "The reluctance to use the word \u201cnature\u201d in political discussions may very well come from a reluctance to acknowledge that there are independent partners on this planet. People are but one part of nature. This recognition is inconsistent with speaking about \u201cour\u201d natural environment, which somehow puts nature into the role of an infrastructure, into the role of something that is there to accommodate us, to facilitate or be part of our lives, subject to our planning. Such a mindset makes nature into a construct rather than seeing nature as a force or entity with its own dynamics.",
                "location": 1029,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385370,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358996"
            },
            {
                "id": 568358997,
                "text": "There are many ways, some of them seemingly small, in which the real world of technology denies the existence and the reality of nature. For instance, there is little sense of season as one walks through a North American or western European supermarket. As a child in Berlin, I still experienced a sense of special occasion when participating in small festive events around the family table to celebrate the first asparagus of the season, the first strawberries, the rare and special gift of an orange in winter. Today such occasions for marking the seasons are rare. Just as there is little sense of season, there is little sense of climate. Everything possible is done to equalize the ambience \u2014 to construct an environment that is warm in the winter, cool in the summer \u2014 equilibrating temperature and humidity to create an environment that does not reflect nature. Nature is then the outside for \u201cus\u201d who are in an internal cocoon. Indeed, technology does allow us to design nature out of much of our lives. This, however, may be quite stupid. People are part of nature whether they like it or not. Machines and instruments will thrive and work well in even temperatures and constant humidity. People, in fact, may not. For the sake of our own mental and physical health, we may need the rhythm of the seasons and the experience of different climates that can link us to nature and to life.",
                "location": 1033,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385371,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358997"
            },
            {
                "id": 568358998,
                "text": "In no way do I wish to deny the urgent task of \u201ccleaning up the environment,\u201d as it is often phrased. But I would like to stress that there is also the urgent task of cleaning up the technocentric and egocentric mindset, to get rid of the notion that nature is just one more infrastructure in the real world of technology. Sometimes I think if I were granted one wish, it would be that the Canadian government would treat nature the way Canadian governments have always treated the United States of America \u2014 with utmost respect and as a great power. Whenever suggestions for political action are placed before the government of Canada, the first consideration always seems to be \u201cWhat about the Americans? They may not like it. They may let their displeasure be seen and felt. They may retaliate!\u201d And what about nature? Obviously nature does not take kindly to what is going on in the real world of technology. Nature is retaliating, and we\u2019d better understand why and how this is happening. I would therefore suggest to you that, in all processes of planning, nature should be considered as a strong and independent power. Ask, \u201cWhat will nature do?\u201d before asking, \u201cWhat will the Americans do?\u201c",
                "location": 1043,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385372,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358998"
            },
            {
                "id": 568358999,
                "text": "When I talked earlier about the need to look at technology in context, I meant the context of nature and people. When predictions turn out to be as wrong as many of those in The World in 1984, it is because context is not a passive medium but a dynamic counterpart. The responses of people, individually and collectively, and the responses of nature are often underrated in the formulation of plans and predictions. Electrical engineers speak about inductive coupling: A changing field induces a current, which may induce a counter-current. Change produces changes, often in different dimensions and magnitudes. Maybe what the real world of technology needs more than anything else are citizens with a sense of humility \u2014 the humility of Kepler or Newton, who studied the universe but knew that they were not asked to run it.",
                "location": 1086,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:53.243Z",
                "updated_at": "2023-07-24T01:01:53.243Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 30388241,
                "tags": [
                    {
                        "id": 133385373,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568358999"
            }
        ]
    },
    {
        "user_book_id": 29751386,
        "title": "The Soul of A New Machine",
        "author": "Tracy Kidder",
        "readable_title": "The Soul of a New Machine",
        "source": "kindle",
        "cover_image_url": "https://images-na.ssl-images-amazon.com/images/I/51c%2BlYoSnbL._SL75_.jpg",
        "unique_url": null,
        "book_tags": [],
        "category": "books",
        "document_note": null,
        "readwise_url": "https://readwise.io/bookreview/29751386",
        "source_url": null,
        "asin": "B005HG4W9W",
        "highlights": [
            {
                "id": 568359000,
                "text": "His crowning domestic achievement, though, was his basement workshop. Most of the basement\u2019s walls were made of fieldstones, laid up dry originally, but covered now with cement in such a way that you could see the outlines of the boulders. This masonry had not been done without some communal effort apparently, for on one wall, in black paint, this question was inscribed: What\u2019s A Place Like This Doing To A Nice Girl Like You?",
                "location": 2508,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:54.218Z",
                "updated_at": "2023-07-24T01:01:54.218Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 29751386,
                "tags": [
                    {
                        "id": 133385346,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568359000"
            },
            {
                "id": 568359001,
                "text": "He went to Amherst College, in western Massachusetts, where he studied the natural sciences. He did so without academic distinction, and it happened that Amherst was just then embracing a new Calvinist fad called the underachiever program: young men whose brains seemed much better than their grades were expelled for a year, so that they might improve their characters. At Amherst, certainly, and possibly in the entire nation, West became the first officially branded underachiever. It was something he\u2019d always remember.",
                "location": 2543,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:54.218Z",
                "updated_at": "2023-07-24T01:01:54.218Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 29751386,
                "tags": [
                    {
                        "id": 133385348,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568359001"
            },
            {
                "id": 568359002,
                "text": "Trying to name the social change he thought he\u2019d seen beginning, West would say, \u201cPeople were leaving Harvard and becoming masons.\u201d As for himself, he decided to become an engineer. Some of his friends were astonished. The very word, engineer, dulled the spirit. It was something your father might be interested in. \u201cI think I wanted to see how complicated things happen,\u201d West said years later. \u201cThere\u2019s some notion of control, it seems to me, that you can derive in a world full of confusion if you at least understand how things get put together. Even if you can\u2019t under stand every little part, how infernal machines get put together.\u201d",
                "location": 2550,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:54.219Z",
                "updated_at": "2023-07-24T01:01:54.219Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 29751386,
                "tags": [
                    {
                        "id": 133385349,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568359002"
            },
            {
                "id": 568359003,
                "text": "Old friends and acquaintances whom West had known back in Cambridge had become famous or semifamous musicians. He expressed no illusions about aping their success, but it made him want to take up the guitar seriously again. He\u2019d support his family with some easy, mindless job. He figured he had to find a job that would keep him out of the military draft, for this was during the late sixties, when politicians still talked of nailing the coonskin cap to the walls of Cam Ranh Bay. A couple of the older engineers in West\u2019s team would tell the same story; they avoided the Vietnam War by joining companies that were making things for it.",
                "location": 2564,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:54.219Z",
                "updated_at": "2023-07-24T01:01:54.219Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 29751386,
                "tags": [
                    {
                        "id": 133385350,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568359003"
            },
            {
                "id": 568359004,
                "text": "It did not work out as he planned. \u201cI thought I\u2019d get a really dumb job. I found out dumb jobs don\u2019t work. You come home too tired to do anything,\u201d he said. He remembered a seemingly endless succession of meetings out of which only the dullest, most cautious decisions could emerge. He remembered watching himself play with his thumbs beneath the edges of conference tables for hours and hours.",
                "location": 2575,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:54.219Z",
                "updated_at": "2023-07-24T01:01:54.219Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 29751386,
                "tags": [
                    {
                        "id": 133385351,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568359004"
            },
            {
                "id": 568359005,
                "text": "To the observant Rosemarie, it seemed that West was always planning. She began to believe that he planned almost everything that happened during the season of Eagle. As time went on he seemed to grow skinnier and skinnier before her eyes, as if the job and all that planning were somehow consuming his flesh. Once in a while she would look into his office. He would be staring at some paper and wouldn\u2019t notice her standing in the doorway. She would watch for a moment. \u201cWhy is he doing this?\u201d she wondered. \u201cHe belongs in the north woods somewhere, canoeing and fishing and appreciating nature. He doesn\u2019t belong here.\u201d",
                "location": 2591,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-23T04:56:00Z",
                "created_at": "2023-07-24T01:01:54.219Z",
                "updated_at": "2023-07-24T01:01:54.219Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 29751386,
                "tags": [
                    {
                        "id": 133385352,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568359005"
            },
            {
                "id": 568605954,
                "text": "I traveled with West to New York. We stopped at a grocery store in which the cash registers were equipped with one of those devices that reads the price of an item automatically, a computerized checkout system. This one wasn\u2019t working well. West got down on his hands and knees and poked his head in under the cashier\u2019s counter to have a look at the thing. The clerk made her mouth an O. When West came out, dusting off his hands, he explained that he had helped design this particular model when he had worked at RCA. \u201cIt\u2019s a kludge,\u201d he said grinning. The clerk had some trouble figuring what the beer we bought ought to cost, and as we left, West said, out of her earshot, \u201cUmmmmh, one of the problems with machines like that. You end up making people so dumb they can\u2019t figure out how many six-packs are in a case of beer.\u201d",
                "location": 2612,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-24T04:56:00Z",
                "created_at": "2023-07-24T14:15:31.530Z",
                "updated_at": "2023-07-24T14:15:31.530Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 29751386,
                "tags": [
                    {
                        "id": 133431957,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568605954"
            },
            {
                "id": 568605955,
                "text": "West didn\u2019t seem to like many of the fruits of the age of the transistor. Of machines he had helped to build, he said, \u201cIf you start getting interested in the last one, then you\u2019re dead.\u201d But there was more to it. \u201cThe old things, I can\u2019t bear to look at them. They\u2019re clumsy. I can\u2019t believe we were that dumb.\u201d He spoke about the rapidity with which computers became obsolete. \u201cYou spend all this time designing one machine and it\u2019s only a hot box for two years, and it has all the useful life of a washing machine.\u201d He said, \u201cI\u2019ve seen too many machines.\u201d One winter night, at his home, while he was stirring up the logs in his fireplace, he muttered, \u201cComputers are irrelevant.\u201d",
                "location": 2625,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-24T04:56:00Z",
                "created_at": "2023-07-24T14:15:31.530Z",
                "updated_at": "2023-07-24T14:15:31.530Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 29751386,
                "tags": [
                    {
                        "id": 133431958,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568605955"
            },
            {
                "id": 568605956,
                "text": "In his office one relatively serene afternoon, West said he had heard that IBM had canceled plans for a certain new computer, because the machine promised to be so complex that any given engineer would need more than a lifetime to understand it fully. \u201cI don\u2019t know why they didn\u2019t just build the thing and see what it would do,\u201d said West. Eagle\u2019s complexity fell far short of that mark, but it was complicated enough to defy single-handed efforts. \u201cI always wanted to do something like this,\u201d he said. \u201cBuild something larger than myself.",
                "location": 2639,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-24T04:56:00Z",
                "created_at": "2023-07-24T14:15:31.531Z",
                "updated_at": "2023-07-24T14:15:31.531Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 29751386,
                "tags": [
                    {
                        "id": 133431959,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568605956"
            },
            {
                "id": 568605957,
                "text": "I was lying in West\u2019s guest bedroom very late one night. His wife and two daughters had turned in long ago. On the perimeter of sleep, I heard West out in the living room take up his guitar and sing. He sounded rusty, but his voice, a tenor, could carry a tune nicely. He did not sing the sorts of songs that I gathered he played currently with his friends at their jam sessions, but once-popular folk songs\u2014\u201cThe Banks of the O-hi-o\u201d and the like. Those are seductive ballads. If you listen to them long enough, you can start believing that your way in life is strewn with possibilities.",
                "location": 2651,
                "location_type": "location",
                "note": "",
                "color": "blue",
                "highlighted_at": "2023-07-24T04:56:00Z",
                "created_at": "2023-07-24T14:15:31.531Z",
                "updated_at": "2023-07-24T14:15:31.531Z",
                "external_id": null,
                "end_location": null,
                "url": null,
                "book_id": 29751386,
                "tags": [
                    {
                        "id": 133431960,
                        "name": "blue"
                    }
                ],
                "is_favorite": false,
                "is_discard": false,
                "readwise_url": "https://readwise.io/open/568605957"
            }
        ]
    }
]

const convertReadwiseHighlightsToSupabase = async (data) => {
    for (const highlightWrapper of data) {
        const highlights = highlightWrapper.highlights
        const title = highlightWrapper.title
        const author = highlightWrapper.author
        const cover_image_url = highlightWrapper.cover_image_url
        const readwise_book_url = highlightWrapper.readwise_url
        const asin = highlightWrapper.asin
        const book_id = highlightWrapper.user_book_id


    /*
    schema for highlights and books

    {
	id
	text
	location
	location_type
	created_at
	readwise_url
	book_id
	book
		title
		author
		cover_image_url
		readwise_url
        book_id
    }
    */

    // insert books from highlights if they don't exist
        const bookExists = await supabase.from('books').select('*').eq('book_id', book_id)

        if (!bookExists.data.length > 0) {
            const { data, error } = await supabase.from('books').insert({
                title,
                author,
                cover_image_url,
                readwise_url: readwise_book_url,
                asin,
                book_id
            })

            if (error) {
                console.log(error)
            } else {
                console.log(`book: ${title} inserted`)
            }
        }  else {
            console.log(`book: ${title} already exists`)
        }

        // insert highlights
        // every 2950 highlights, wait 1 minute
        let i = 0
        for (const highlight of highlights) {

            if (i % 2950 === 0 && i !== 0) {
                console.log("waiting 1 minute")
                await new Promise(resolve => setTimeout(resolve, 60000));
            }

            const text = highlight.text
            const location = highlight.location
            const location_type = highlight.location_type
            const created_at = highlight.highlighted_at
            const readwise_url = highlight.readwise_url
            const book_id = highlight.book_id
            const id = highlight.id

            // check if highlight exists
            const highlightExists = await supabase.from('highlights').select('*').eq('id', id)

            if (!highlightExists.data.length > 0) {
                const embeddingArr = await getEmbedding(text)

                const { data, error } = await supabase.from('highlights').insert({
                    text,
                    location,
                    location_type,
                    created_at,
                    readwise_url,
                    book_id,
                    embedding: embeddingArr,
                    id
                })

                if (error) {
                    console.log(error)
                } else {
                    console.log(`highlight: ${text} inserted`)
                }
            } else {
                console.log(`highlight: ${text} already exists`)
            }
        }
    }

}



const filterHighlightsByCategory = (highlights, category) => {
    return highlights.filter(highlight => highlight.category === category)
}


const justBooks = async () => {
    // read data.json using fs
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'))
    const filteredData = filterHighlightsByCategory(data, "books")
    await convertReadwiseHighlightsToSupabase(filteredData)

    /// ~10k highlights
    // console.log(filteredData.length)

    // // aggregate all highlights into one array
    // const highlights = []
    // for (const book of filteredData) {
    //     highlights.push(...book.highlights)
    // }

    // console.log(highlights.length)
}

// justBooks()


const similaritySearch = async (query) => {
    const embedding = await getEmbedding(query)
    const res = []

    const { data: documents, error } = await supabase.rpc('match_highlights', {
        query_embedding: embedding, 
        match_count: 3, 
        match_threshold: 0.0
      })

    for (const document of documents) {
        const { data: highlights, error } = await supabase.from('highlights').select('*').eq('id', document.id)
        const book_id = highlights[0].book_id
        const { data: books, error: bookError } = await supabase.from('books').select('*').eq('book_id', book_id)


        res.push({
            text: highlights[0].text,
            title: books[0].title,
            similarity: document.similarity
        })
    }

    if (error) { 
        console.log(error)
        return
    }

    return res
}

/*
return in this format
{
    text
    title
    similarity
}
*/



/*

convert the similarity search results to alfred format

echo "<?xml version='1.0'?><items>"

for project_path in "$projects_path"/*
do
  project=$(basename "$project_path")
  echo "<item uid='$project' arg='$project$unicode_split' query='$query' valid='YES'><title>$project</title><subtitle>Append to Resources.md in this project</subtitle></item>"
done

echo "</items>"
*/

const convertToAlfred = async (query) => {
    const results = await similaritySearch(query)
    const sortedResults = results.sort((a, b) => b.similarity - a.similarity)
    console.log("<?xml version='1.0'?><items>")
    for (const result of sortedResults) {
        console.log(`<item uid='${result.text}' arg='${result.text}' query='${query}' valid='YES'><title>${result.text}</title><subtitle>${result.title} - ${result.similarity}</subtitle></item>`)
    }
    console.log("</items>")
}

// run semantic search on terminal arg (include spaces) and remove the ? at the end
convertToAlfred(process.argv.slice(2).join(" ").replace("?", ""))

