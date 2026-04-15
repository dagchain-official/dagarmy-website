"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import CountdownTimer from "@/components/bidding/CountdownTimer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* ── Palette matches dashboard ──────────────────────────── */
const BG     = "#f0f2f5";
const FONT   = "'Manrope','Inter',sans-serif";
const NASA   = "'Nasalization','Manrope',sans-serif";
const PURPLE = "#4f46e5";
const PURPLE2= "#7c3aed";
const LOGO   = "/images/logo/logo.png";   // official DAGARMY logo

/* Neumorphic shadows tuned for #f0f2f5 */
const S = {
  card:    "8px 8px 18px rgba(163,177,198,0.65), -8px -8px 18px rgba(255,255,255,0.92)",
  convex:  "5px 5px 10px rgba(163,177,198,0.5),  -5px -5px 10px rgba(255,255,255,0.88)",
  concave: "inset 5px 5px 10px rgba(163,177,198,0.5),  inset -5px -5px 10px rgba(255,255,255,0.88)",
  btn:     "4px 4px 9px rgba(163,177,198,0.6),   -4px -4px 9px rgba(255,255,255,0.92)",
  pressed: "inset 3px 3px 7px rgba(163,177,198,0.6),  inset -3px -3px 7px rgba(255,255,255,0.88)",
  input:   "inset 3px 3px 7px rgba(163,177,198,0.5),  inset -3px -3px 7px rgba(255,255,255,0.88)",
};
const T = { primary:"#1e293b", dark:"#334155", muted:"#4a5568", light:"#64748b" };

/* ── Demo images ─────────────────────────────────────────── */
const IMG = {
  macbook:"https://lh3.googleusercontent.com/aida-public/AB6AXuCWwNEV6MZnBTEEDy1WU_ePkz4pxHeXfWqu_tU0D7_EzsjQ0MMQJX96CUJ1Db1qa3DSpLMPuVmU3qN5cmnRbaHSC1KtJ5Y6L7eb52UEt9zwbuAA69wUfs-OD_Br3q3czYvn9d1kHHPjt7banPjbnitnu3fLmVW-iWqSjJpyweza-Nzap2whDLCy_iwGs2I3MIbuZzqPFucD8L15giT3Kx39XYg1AqO0ZN0_H7H1tca4IK8oV_gHsGfL-khY-DQdRnvdwCtIIO8DVigQ",
  iphone: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWrfS3ebCK748UfDr28Ftp5dw-RKikAZVuWDOvkpPAGBlKEEiI3zc5vcZm2yEHBIptU587GWSxHRopZrJMOsiVZY7Ci_m55SHKvxQ5r_ETYR2JQPkuYjRDGNlKpBUqzF4ZgOPDrkRn__x5dQ3fGGk7S5loOoO9S7vMROLKfAPrlGAAgIDYjhWTXqIpw49yBrLgh4FUcj7sv2ofP4pnKjw7zjydk1Mn8dSMHhC6r3DI5fa5fR2z_PSZYvwOdlchm3HtsxSM3xPsiwCr",
  ipad:   "https://lh3.googleusercontent.com/aida-public/AB6AXuCTq_GvhbBPgmWtnujv73Iqn5H7p5v-N5tDHhQGAoxqKLeaYiWNG7_7kCKsUtbss3peGxJplzE6fgRWDFpZYyRZNX_vXTaf6krvm-NqC0_1eaCBT9JUeXFJIiyGyISwIBykOLIJgqONNTx1SPOLU191kQ67pUI7ST73HnigsSozTxaBeYKh8GeGIHYD6fXbBCTZ5vo2-R8SYPnC_0ExlwbTJkdb4ZIZn_T48eiLhbPMSopeYHIzyHduZMrtugKPmonVgRuAh4-ECiB9",
};

const DEMO_ENDS   = () => new Date(Date.now()+14*3600000+32*60000).toISOString();
const DEMO_CLOSED = () => new Date(Date.now()-26*3600000).toISOString();

const DEMO_ITEMS = [
  {id:"demo-1",title:"MacBook Pro M4 Max",status:"active",images:[{url:IMG.macbook,is_primary:true}],starting_bid:1000000,min_increment:50000,max_winners:1,current_highest_bid:1250000,total_bids_count:30,ends_at:DEMO_ENDS(),starts_at:null,_isDemo:true},
  {id:"demo-2",title:"iPhone 16 Pro Max",status:"active",images:[{url:IMG.iphone,is_primary:true}],starting_bid:500000,min_increment:25000,max_winners:1,current_highest_bid:750000,total_bids_count:22,ends_at:new Date(Date.now()+10*3600000).toISOString(),starts_at:null,_isDemo:true},
  {id:"demo-3",title:"iPad Pro M4",status:"upcoming",images:[{url:IMG.ipad,is_primary:true}],starting_bid:400000,min_increment:20000,max_winners:2,current_highest_bid:0,total_bids_count:0,ends_at:null,starts_at:new Date(Date.now()+48*3600000).toISOString(),_isDemo:true},
  {id:"demo-4",title:"AirPods Pro 2",status:"upcoming",images:[{url:IMG.iphone,is_primary:true}],starting_bid:120000,min_increment:10000,max_winners:3,current_highest_bid:0,total_bids_count:0,ends_at:null,starts_at:new Date(Date.now()+72*3600000).toISOString(),_isDemo:true},
  {id:"demo-5",title:"Apple Watch Ultra 2",status:"upcoming",images:[{url:IMG.macbook,is_primary:true}],starting_bid:200000,min_increment:15000,max_winners:2,current_highest_bid:0,total_bids_count:0,ends_at:null,starts_at:new Date(Date.now()+96*3600000).toISOString(),_isDemo:true},
  {id:"demo-6",title:"Sony OLED 65\" TV",status:"closed",images:[{url:IMG.ipad,is_primary:true}],starting_bid:300000,min_increment:20000,max_winners:1,current_highest_bid:580000,total_bids_count:45,ends_at:DEMO_CLOSED(),starts_at:null,_isDemo:true,_winner:"@CryptoQueen"},
];

const DEMO_BIDS = [
  {id:"db1",user_id:"u1",bid_amount:1250000,user:{full_name:"Crypt0King"}},
  {id:"db2",user_id:"u2",bid_amount:1210000,user:{full_name:"AlphaDAG"}},
  {id:"db3",user_id:"u3",bid_amount:1180000,user:{full_name:"DAGmaster"}},
  {id:"db4",user_id:"u4",bid_amount:1150000,user:{full_name:"SniperX"}},
  {id:"db5",user_id:"u5",bid_amount:1130000,user:{full_name:"WhaleFund"}},
  {id:"db6",user_id:"u2",bid_amount:1120000,user:{full_name:"AlphaDAG"}},
  {id:"db7",user_id:"u3",bid_amount:1080000,user:{full_name:"DAGmaster"}},
  {id:"db8",user_id:"u6",bid_amount:1050000,user:{full_name:"Frahan72"}},
];
const DEMO_WINNERS = [
  {user:{id:"u5",full_name:"TheWhale"},total:8200000,wins:12},
  {user:{id:"u6",full_name:"FortunateSon"},total:7100000,wins:9},
  {user:{id:"u3",full_name:"DAGmaster"},total:7300000,wins:8},
  {user:{id:"u7",full_name:"Lornentrys"},total:6300000,wins:7},
  {user:{id:"u8",full_name:"Frahan72"},total:5000000,wins:6},
  {user:{id:"u9",full_name:"coolty"},total:4700000,wins:5},
];

const SEED_CHAT = [
  {id:"s1",type:"system",text:"@System Auction House is now live!"},
  {id:"s2",type:"user",user:"DAGsoldier12",text:"Sniper time! 🔥"},
  {id:"s3",type:"user",user:"CryptoQueen",text:"Insane drop. DAG Points ready!"},
  {id:"s4",type:"system",text:"@Crypt0King outbid @AlphaDAG → 1,250,000 DAG Points"},
  {id:"s5",type:"system",text:"@WhaleFund joined the auction pool"},
  {id:"s6",type:"user",user:"CryptoQueen",text:"Let's go! 🚀"},
  {id:"s7",type:"system",text:"Real-time updates — drop your bid now!"},
];

function sortedPool(items){
  const a=items.filter(x=>x.status==="active").sort((a,b)=>new Date(a.ends_at)-new Date(b.ends_at));
  const u=items.filter(x=>x.status==="upcoming").sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  const c=items.filter(x=>x.status==="closed").sort((a,b)=>new Date(b.ends_at)-new Date(a.ends_at));
  return [...a,...u,...c];
}

/* ── SVG icon components ─────────────────────────────────── */
const IcoAuction = ({c})=>(
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 5l4 4"/><path d="M9 11l-6 6 2 2 6-6"/><path d="M14.5 7.5l-5 5"/><path d="M20 4l-1 1-4-4 1-1 4 4z"/>
  </svg>
);
const IcoPeople = ({c})=>(
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoBid = ({c})=>(
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IcoTrophy = ({c})=>(
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
  </svg>
);

/* Tiny DAG logo inline */
const DagLogo = ({size=12})=>(
  <img src={LOGO} alt="DAG" style={{width:size,height:size,objectFit:"contain",verticalAlign:"middle",flexShrink:0}}/>
);

export default function AuctionHallPage(){
  const [allItems,      setAllItems]      = useState([]);
  const [featured,      setFeatured]      = useState(null);
  const [itemBids,      setItemBids]      = useState([]);
  const [winnersLB,     setWinnersLB]     = useState([]);
  const [chatMsgs,      setChatMsgs]      = useState(SEED_CHAT);
  const [chatInput,     setChatInput]     = useState("");
  const [userId,        setUserId]        = useState(null);
  const [userName,      setUserName]      = useState("");
  const [userPoints,    setUserPoints]    = useState(0);
  const [myBids,        setMyBids]        = useState(0);
  const [myWins,        setMyWins]        = useState(0);
  const [activeBidders, setActiveBidders] = useState(0);
  const [increment,     setIncrement]     = useState(1);
  const [imgIdx,        setImgIdx]        = useState(0);
  const [placing,       setPlacing]       = useState(false);
  const [feedback,      setFeedback]      = useState(null);
  const [dbEmpty,       setDbEmpty]       = useState(true);
  const chatRef = useRef(null);

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      const uid=data?.user?.id; setUserId(uid);
      if(!uid) return;
      supabase.from("users").select("full_name,dag_points").eq("id",uid).single()
        .then(({data:u})=>{ setUserName(u?.full_name||""); setUserPoints(u?.dag_points||0); });
      supabase.from("bids").select("item_id",{count:"exact",head:true}).eq("user_id",uid)
        .then(({count})=>setMyBids(count||0));
      supabase.from("bids").select("id",{count:"exact",head:true}).eq("user_id",uid).eq("status","won")
        .then(({count})=>setMyWins(count||0));
    });
  },[]);

  const load=useCallback(async()=>{
    try{
      const{data}=await supabase.from("bid_items")
        .select("id,title,description,images,status,starts_at,ends_at,starting_bid,min_increment,max_winners,current_highest_bid,total_bids_count,total_dag_locked")
        .order("ends_at",{ascending:true});
      const all=data||[];
      if(all.length>0){
        setDbEmpty(false); setAllItems(all);
        setFeatured(f=>f?._isDemo?(all.find(x=>x.status==="active")||all[0]):(all.find(x=>x.id===f?.id)||all[0]));
        const activeIds=all.filter(x=>x.status==="active").map(x=>x.id);
        if(activeIds.length){const{count}=await supabase.from("bids").select("user_id",{count:"exact",head:true}).in("item_id",activeIds);setActiveBidders(count||0);}
      }else{
        setDbEmpty(true);setAllItems(DEMO_ITEMS);
        setFeatured(f=>f||DEMO_ITEMS[0]);setActiveBidders(52);
      }
    }catch{setDbEmpty(true);setAllItems(DEMO_ITEMS);setFeatured(f=>f||DEMO_ITEMS[0]);setActiveBidders(52);}
  },[]); // eslint-disable-line
  useEffect(()=>{load();},[load]);

  const loadBoards=useCallback(async(id,isDemo)=>{
    if(isDemo){setItemBids(DEMO_BIDS);setWinnersLB(DEMO_WINNERS);return;}
    try{
      const{data:ib}=await supabase.from("bids").select("id,bid_amount,user_id,user:users(id,full_name)").eq("item_id",id).order("bid_amount",{ascending:false}).limit(8);
      setItemBids(ib?.length?ib:DEMO_BIDS);
      const{data:wb}=await supabase.from("bids").select("user_id,bid_amount,user:users(id,full_name)").eq("status","won");
      const map={};(wb||[]).forEach(b=>{if(!map[b.user_id])map[b.user_id]={user:b.user,total:0,wins:0};map[b.user_id].total+=b.bid_amount||0;map[b.user_id].wins+=1;});
      const sorted=Object.values(map).sort((a,b)=>b.total-a.total).slice(0,6);
      setWinnersLB(sorted.length?sorted:DEMO_WINNERS);
    }catch{setItemBids(DEMO_BIDS);setWinnersLB(DEMO_WINNERS);}
  },[]);
  useEffect(()=>{if(featured?.id){loadBoards(featured.id,!!featured._isDemo);setImgIdx(0);}},[featured?.id,loadBoards]); // eslint-disable-line

  useEffect(()=>{
    if(dbEmpty)return;
    const ch=supabase.channel("auction-v7")
      .on("postgres_changes",{event:"*",schema:"public",table:"bids"},()=>{load();if(featured?.id)loadBoards(featured.id,false);})
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"bid_activity_log"},async(p)=>{
        const{data:u}=await supabase.from("users").select("full_name").eq("id",p.new.user_id).single();
        setChatMsgs(prev=>[...prev,{id:p.new.id,type:"system",text:`@${u?.full_name?.split(" ")[0]||"someone"} bid ${p.new.total_bid?.toLocaleString()} DAG Points`}].slice(-60));
      }).subscribe();
    return()=>supabase.removeChannel(ch);
  },[featured?.id,dbEmpty,load,loadBoards]);

  useEffect(()=>{chatRef.current?.scrollTo({top:chatRef.current.scrollHeight,behavior:"smooth"});},[chatMsgs]);

  const isDemo   = !!featured?._isDemo;
  const isClosed = featured?.status==="closed";
  const isActive = featured?.status==="active";
  const bidCost  = (featured?.min_increment||0)*increment;
  const afterBid = userPoints-bidCost;
  const highBid  = featured?.current_highest_bid||featured?.starting_bid||0;
  const images   = featured?.images||[];
  const mainImg  = images[imgIdx]||images[0];
  const pool     = sortedPool(allItems);
  const activeCount = allItems.filter(x=>x.status==="active").length||(dbEmpty?2:0);

  const placeBid=async()=>{
    if(!featured||placing||isDemo||!isActive)return;
    setPlacing(true);setFeedback(null);
    try{
      const res=await fetch(`/api/bidding/items/${featured.id}/bid`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId,amount:bidCost})});
      const d=await res.json();
      if(d.success){setFeedback({ok:true,text:`✓ Bid placed! ${d.new_total?.toLocaleString()} DAG Points`});setUserPoints(d.dag_points??afterBid);load();loadBoards(featured.id,false);}
      else setFeedback({ok:false,text:d.error||"Failed"});
    }catch{setFeedback({ok:false,text:"Network error"});}
    setPlacing(false);setTimeout(()=>setFeedback(null),3000);
  };

  const sendChat=()=>{
    if(!chatInput.trim())return;
    setChatMsgs(p=>[...p,{id:Date.now(),type:"user",user:userName?.split(" ")[0]||"You",text:chatInput.trim()}]);
    setChatInput("");
  };

  /* ── Stat cards config — NO emojis, pure SVG + DAGARMY logo ── */
  const statCards=[
    {label:"Active Auctions", value:activeCount,                              accent:PURPLE,  icon:<IcoAuction c={PURPLE}/>},
    {label:"Active Bidders",  value:dbEmpty?52:activeBidders,                accent:PURPLE2, icon:<IcoPeople c={PURPLE2}/>},
    {label:"My DAG Points",   value:`${(userPoints/1000).toFixed(1)}K`,      accent:PURPLE,  icon:<img src={LOGO} alt="DAG" style={{width:22,height:22,objectFit:"contain"}}/>},
    {label:"My Active Bids",  value:dbEmpty?3:myBids,                        accent:PURPLE2, icon:<IcoBid c={PURPLE2}/>},
    {label:"My Wins",         value:dbEmpty?1:myWins,                        accent:PURPLE,  icon:<IcoTrophy c={PURPLE}/>},
  ];

  /* ── Section title row: fixed 30px so all 3 cols start at same Y ── */
  const SecTitle = ({children,align="left"})=>(
    <div style={{height:30,display:"flex",alignItems:"center",justifyContent:align==="center"?"center":"flex-start",marginBottom:8,flexShrink:0}}>
      {children&&<p style={{margin:0,fontSize:11,fontWeight:900,color:T.muted,textTransform:"uppercase",letterSpacing:"0.14em"}}>{children}</p>}
    </div>
  );

  return (
    <div style={{background:BG,display:"flex",flexDirection:"column",fontFamily:FONT,
      paddingTop:85,paddingLeft:24,paddingRight:24,paddingBottom:24,boxSizing:"border-box",minHeight:"100vh"}}>

      {/* ══════ STAT CARDS: aligned with Dashboard→My Courses (120px) ══════ */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16,height:120,flexShrink:0,marginBottom:24}}>
        {statCards.map(s=>(
          <div key={s.label} style={{background:BG,boxShadow:S.card,borderRadius:22,padding:"0 22px",display:"flex",alignItems:"center",gap:16,height:"100%"}}>
            <div style={{background:BG,boxShadow:S.concave,borderRadius:14,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {s.icon}
            </div>
            <div>
              <p style={{margin:"0 0 4px",fontSize:26,fontWeight:900,color:s.accent,letterSpacing:"-0.7px",lineHeight:1}}>{s.value}</p>
              <p style={{margin:0,fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",lineHeight:1.3}}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ══════ MAIN 3-COLUMN: height 578px → ends at DAG Lieutenant ══════ */}
      {/* Each outer col is a flex-col: [SecTitle 38px fixed] + [card flex:1] */}
      <div style={{display:"grid",gridTemplateColumns:"3fr 4fr 2fr",gap:16,height:578,flexShrink:0,marginBottom:24}}>

        {/* ── Col 1: BANNER ── */}
        <div style={{display:"flex",flexDirection:"column",minHeight:0}}>
          <SecTitle>{/* empty — same height as other col titles */}</SecTitle>
          <div style={{flex:1,background:BG,boxShadow:S.card,borderRadius:22,padding:18,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>

            {/* Image well */}
            <div style={{background:BG,boxShadow:S.concave,borderRadius:16,flex:1,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",marginBottom:12,overflow:"hidden",minHeight:0}}>
              {images.length>1&&(<button onClick={()=>setImgIdx(i=>(i-1+images.length)%images.length)} style={{position:"absolute",left:8,zIndex:2,background:BG,boxShadow:S.btn,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:16,color:T.dark,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>)}
              {isClosed?(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:14,textAlign:"center"}}>
                  {mainImg&&<img src={mainImg.url} alt="" style={{width:"50%",objectFit:"contain",opacity:0.35,filter:"grayscale(60%)"}}/>}
                  <p style={{margin:"0 0 4px",fontSize:15,fontWeight:900,color:PURPLE,letterSpacing:"0.05em"}}>🔒 AUCTION ENDED</p>
                  {featured?._winner&&<p style={{margin:0,fontSize:13,fontWeight:700,color:T.dark}}>Winner: <span style={{color:PURPLE,fontWeight:900}}>{featured._winner}</span></p>}
                </div>
              ):mainImg?(
                <img src={mainImg.url} alt={featured?.title} key={imgIdx} style={{width:"80%",maxHeight:"100%",objectFit:"contain",animation:"fadeIn 0.3s ease"}}/>
              ):(
                <div style={{opacity:0.25,textAlign:"center"}}><span style={{fontSize:38}}>📦</span></div>
              )}
              {images.length>1&&(<button onClick={()=>setImgIdx(i=>(i+1)%images.length)} style={{position:"absolute",right:8,zIndex:2,background:BG,boxShadow:S.btn,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:16,color:T.dark,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>)}
              {images.length>1&&<div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:4}}>{images.map((_,i)=><div key={i} style={{width:i===imgIdx?14:6,height:6,borderRadius:3,background:i===imgIdx?PURPLE:"#c1c9d4",transition:"all 0.3s"}}/>)}</div>}
            </div>

            {/* Product info */}
            <div style={{flexShrink:0,display:"flex",flexDirection:"column",gap:8}}>
              {/* Title + countdown + available — all inline */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:"0 0 2px",fontSize:9,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.1em"}}>Product</p>
                  <h3 style={{margin:0,fontSize:18,fontWeight:900,color:T.primary,fontFamily:NASA,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{featured?.title||"Select an auction"}</h3>
                </div>
                {/* Live + Available — SIDE BY SIDE */}
                <div style={{display:"flex",gap:6,flexShrink:0,alignItems:"stretch"}}>
                  <div style={{background:BG,boxShadow:S.concave,borderRadius:10,padding:"5px 10px",textAlign:"center"}}>
                    <p style={{margin:"0 0 1px",fontSize:8,fontWeight:800,color:T.muted,textTransform:"uppercase"}}>{isClosed?"Ended":isActive?"Live":"Upcoming"}</p>
                    <p style={{margin:0,fontSize:13,fontWeight:900,color:PURPLE}}>
                      {isDemo&&!isClosed?"14:32:05":<CountdownTimer endsAt={featured?.ends_at} startsAt={featured?.starts_at} status={featured?.status} theme="light" inline/>}
                    </p>
                  </div>
                  <div style={{background:BG,boxShadow:S.concave,borderRadius:10,padding:"5px 10px",textAlign:"center"}}>
                    <p style={{margin:"0 0 1px",fontSize:8,fontWeight:800,color:T.muted,textTransform:"uppercase",whiteSpace:"nowrap"}}>Available</p>
                    <div style={{display:"flex",alignItems:"center",gap:3,justifyContent:"center"}}>
                      <DagLogo size={11}/>
                      <p style={{margin:0,fontSize:13,fontWeight:900,color:PURPLE}}>{(userPoints/1000).toFixed(1)}K</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bid section */}
              {!isClosed&&(
                <>
                  <div>
                    <p style={{margin:"0 0 1px",fontSize:9,fontWeight:700,color:T.muted,textTransform:"uppercase"}}>Highest Bid</p>
                    <p style={{margin:0,fontSize:20,fontWeight:900,color:T.primary,letterSpacing:"-0.5px",lineHeight:1}}>{highBid.toLocaleString()}</p>
                    <p style={{margin:"1px 0 0",fontSize:9,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>DAG Points</p>
                  </div>

                  {/* Controls row */}
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {/* Increment pill */}
                    <div style={{flex:1,display:"flex",flexDirection:"column",gap:2}}>
                      <p style={{margin:0,fontSize:8,fontWeight:800,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Bid Increment ×{increment}</p>
                      <div style={{background:BG,boxShadow:S.concave,borderRadius:999,display:"flex",alignItems:"center",padding:"4px 10px",gap:8}}>
                        <button onClick={()=>setIncrement(v=>Math.max(1,v-1))} style={{background:BG,boxShadow:S.btn,border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:16,color:T.dark,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>−</button>
                        <div style={{flex:1,background:BG,boxShadow:S.pressed,borderRadius:8,padding:"3px 10px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                          <DagLogo size={10}/><span style={{fontSize:13,fontWeight:900,color:T.primary,letterSpacing:"-0.3px",whiteSpace:"nowrap"}}>{bidCost.toLocaleString()}</span>
                        </div>
                        <button onClick={()=>setIncrement(v=>v+1)} style={{background:BG,boxShadow:S.btn,border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:16,color:PURPLE,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>+</button>
                      </div>
                    </div>
                    {/* After-bid */}
                    {bidCost>0&&(
                      <div style={{textAlign:"center",flexShrink:0}}>
                        <p style={{margin:"0 0 2px",fontSize:8,fontWeight:800,color:T.muted,textTransform:"uppercase",whiteSpace:"nowrap"}}>After Bid</p>
                        <p style={{margin:0,fontSize:13,fontWeight:900,color:PURPLE,whiteSpace:"nowrap"}}>{afterBid.toLocaleString()}</p>
                      </div>
                    )}
                    {/* Place Bid button */}
                    {isActive&&!isDemo?(
                      <button onClick={placeBid} disabled={placing||afterBid<0}
                        style={{background:BG,boxShadow:afterBid<0?S.concave:placing?S.pressed:S.btn,border:"none",borderRadius:12,padding:"9px 14px",fontSize:9,fontWeight:900,cursor:afterBid<0?"not-allowed":"pointer",color:afterBid<0?PURPLE2:T.primary,textTransform:"uppercase",letterSpacing:"0.08em",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.15s"}}
                        onMouseDown={e=>afterBid>=0&&(e.currentTarget.style.boxShadow=S.pressed)}
                        onMouseUp={e=>afterBid>=0&&(e.currentTarget.style.boxShadow=S.btn)}>
                        {placing?"Placing…":afterBid<0?"Low Points":"Place Bid"}
                      </button>
                    ):(
                      <div style={{background:BG,boxShadow:S.concave,borderRadius:12,padding:"9px 12px",textAlign:"center",flexShrink:0,opacity:0.5}}>
                        <p style={{margin:0,fontSize:9,fontWeight:900,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",whiteSpace:"nowrap"}}>{isDemo?"Preview":"Upcoming"}</p>
                      </div>
                    )}
                  </div>
                  {feedback&&<div style={{padding:"6px 10px",borderRadius:8,background:BG,boxShadow:S.concave,fontSize:11,fontWeight:700,color:feedback.ok?PURPLE:PURPLE2}}>{feedback.text}</div>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Col 2: LEADERBOARDS ── */}
        <div style={{display:"flex",flexDirection:"column",minHeight:0}}>
          <SecTitle align="center">Leaderboards</SecTitle>
          <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,minHeight:0}}>

            {/* Auction Participants */}
            <div style={{background:BG,boxShadow:S.card,borderRadius:20,padding:"14px 12px 10px",display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{textAlign:"center",marginBottom:10,flexShrink:0}}>
                <p style={{margin:"0 0 2px",fontSize:12,fontWeight:900,color:T.primary,textTransform:"uppercase",letterSpacing:"0.08em"}}>Auction Participants</p>
                <p style={{margin:0,fontSize:10,color:T.muted,fontWeight:600}}>Current auction — staked DAG Points</p>
              </div>
              <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:3,paddingBottom:8}}>
                {itemBids.map((b,i)=>(
                  <BidRow key={b.id} rank={i+1} name={b.user?.full_name} isTop={i===0}
                    value={b.bid_amount>=1000?`${(b.bid_amount/1000).toFixed(0)}k`:`${b.bid_amount}`}
                    isMe={b.user_id===userId} S={S} BG={BG} T={T} PURPLE={PURPLE}/>
                ))}
              </div>
            </div>

            {/* All-Time Winners — 3 columns: name | wins | total */}
            <div style={{background:BG,boxShadow:S.card,borderRadius:20,padding:"14px 12px 10px",display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{textAlign:"center",marginBottom:10,flexShrink:0}}>
                <p style={{margin:"0 0 2px",fontSize:12,fontWeight:900,color:T.primary,textTransform:"uppercase",letterSpacing:"0.08em"}}>All-Time Winners</p>
                <p style={{margin:0,fontSize:10,color:T.muted,fontWeight:600}}>Wins · Total DAG Points spent</p>
              </div>
              {/* Column header */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 32px 56px",gap:4,padding:"0 4px 4px",borderBottom:"1px solid rgba(0,0,0,0.06)",marginBottom:4,flexShrink:0}}>
                <span style={{fontSize:9,fontWeight:800,color:T.light,textTransform:"uppercase",letterSpacing:"0.08em"}}>Player</span>
                <span style={{fontSize:9,fontWeight:800,color:T.light,textTransform:"uppercase",letterSpacing:"0.08em",textAlign:"center"}}>Wins</span>
                <span style={{fontSize:9,fontWeight:800,color:T.light,textTransform:"uppercase",letterSpacing:"0.08em",textAlign:"right"}}>Total</span>
              </div>
              <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:3,paddingBottom:8}}>
                {winnersLB.map((g,i)=>(
                  <WinnerRow key={i} rank={i+1} name={g.user?.full_name}
                    wins={g.wins||0}
                    total={g.total>=1e6?`${(g.total/1e6).toFixed(1)}M`:g.total>=1000?`${(g.total/1000).toFixed(1)}K`:`${g.total}`}
                    isMe={g.user?.id===userId} S={S} BG={BG} T={T} PURPLE={PURPLE}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Col 3: LIVE CHAT ── */}
        <div style={{display:"flex",flexDirection:"column",minHeight:0}}>
          <SecTitle>Live Chat</SecTitle>
          <div style={{flex:1,background:BG,boxShadow:S.card,borderRadius:20,padding:"14px 14px 12px",display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
            <div ref={chatRef} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:7,paddingBottom:8}}>
              <p style={{textAlign:"center",fontSize:9,color:T.light,fontStyle:"italic",margin:0,flexShrink:0}}>✨ Live auction feed active</p>
              {chatMsgs.map((msg,i)=><ChatBubble key={msg.id||i} msg={msg} S={S} BG={BG} T={T} PURPLE={PURPLE}/>)}
            </div>
            <div style={{paddingTop:8,flexShrink:0}}>
              <div style={{background:BG,boxShadow:S.input,borderRadius:12,display:"flex",alignItems:"center",padding:"7px 12px",gap:8}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&sendChat()}
                  placeholder="Type a message…"
                  style={{background:"transparent",border:"none",outline:"none",fontSize:12,flex:1,color:T.primary,fontFamily:FONT,fontWeight:500}}/>
                <button onClick={sendChat} style={{background:BG,boxShadow:S.btn,border:"none",borderRadius:8,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:PURPLE,fontSize:14,flexShrink:0}}>➤</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ AUCTION POOL ══════ */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <p style={{margin:0,fontSize:12,fontWeight:900,color:T.primary,textTransform:"uppercase",letterSpacing:"0.14em"}}>Auction Pool</p>
          <div style={{display:"flex",gap:6}}>
            <button style={{background:BG,boxShadow:S.btn,border:"none",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,color:T.dark}}>‹</button>
            <button style={{background:BG,boxShadow:S.btn,border:"none",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,color:T.dark}}>›</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14}}>
          {pool.slice(0,5).map(item=>{
            const img=item.images?.find(x=>x.is_primary)||item.images?.[0];
            const isSel  = featured?.id===item.id;
            const closed = item.status==="closed";
            const live   = item.status==="active";
            const price  = (item.current_highest_bid||item.starting_bid)||0;
            return(
              <button key={item.id} onClick={()=>setFeatured(item)}
                style={{background:BG,boxShadow:isSel?S.pressed:S.card,borderRadius:18,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,border:"none",cursor:"pointer",textAlign:"left",fontFamily:FONT,transition:"all 0.2s",opacity:closed?0.75:1}}>
                <div style={{width:48,height:48,background:BG,boxShadow:S.concave,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden",filter:closed?"grayscale(50%)":"none"}}>
                  {img?<img src={img.url} alt="" style={{width:34,height:34,objectFit:"contain"}}/>:<span style={{fontSize:20,opacity:0.3}}>📦</span>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  {/* Title — Nasalization */}
                  <p style={{margin:"0 0 3px",fontSize:12,fontWeight:900,color:isSel?PURPLE:closed?T.muted:T.primary,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:NASA}}>{item.title}</p>
                  <p style={{margin:"0 0 6px",fontSize:11,color:live?PURPLE:closed?T.muted:PURPLE2,fontWeight:800,textTransform:"uppercase"}}>
                    {closed?"🔒 Ended":live?"● Live":"◎ Upcoming"}
                  </p>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:2}}>
                      {[0,1].map(j=><div key={j} style={{width:13,height:13,borderRadius:"50%",background:j===0?"#94a3b8":"#b8c4cf",border:"1.5px solid white",marginLeft:j===0?0:-3}}/>)}
                      <span style={{fontSize:11,fontWeight:700,color:T.muted,paddingLeft:3}}>{item.total_bids_count||0}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:3}}>
                      <DagLogo size={11}/>
                      <span style={{fontSize:12,fontWeight:900,color:closed?T.muted:T.primary}}>{price>=1000?`${(price/1000).toFixed(0)}k`:`${price}`}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          {Array.from({length:Math.max(0,5-pool.length)}).map((_,i)=>(
            <div key={`cs-${i}`} style={{background:BG,boxShadow:S.concave,borderRadius:18,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,opacity:0.38}}>
              <div style={{width:48,height:48,background:BG,boxShadow:S.concave,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <IcoTrophy c={T.light}/>
              </div>
              <div>
                <p style={{margin:"0 0 3px",fontSize:12,fontWeight:900,color:T.muted,fontFamily:NASA}}>Coming Soon</p>
                <p style={{margin:0,fontSize:11,color:T.light,fontWeight:600}}>New auction slot</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.cdnfonts.com/css/nasalization');
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&family=Inter:wght@300..700&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:scale(1.02)}to{opacity:1;transform:scale(1)}}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#ccd3de;border-radius:4px}
      `}</style>
    </div>
  );
}

/* ── Bid row (Auction Participants) ─────────────────────── */
function BidRow({rank,name,value,isTop,isMe,S,BG,T,PURPLE}){
  const init=(name||"?").split(" ").map(w=>w[0]).join("").substring(0,2).toUpperCase();
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 4px",borderRadius:10,
      background:isTop?BG:"transparent",boxShadow:isTop?S.concave:"none",border:isTop?"1px solid rgba(255,255,255,0.6)":"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <span style={{fontSize:10,fontWeight:800,width:16,color:isTop?T.primary:T.muted,textAlign:"center",flexShrink:0}}>{rank}</span>
        <div style={{width:24,height:24,borderRadius:"50%",background:BG,boxShadow:isTop?S.convex:S.concave,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {isTop
            ?<svg width="10" height="10" viewBox="0 0 24 24" fill={PURPLE}><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>
            :<span style={{fontSize:9,fontWeight:800,color:isMe?PURPLE:T.muted}}>{init}</span>}
        </div>
        <span style={{fontSize:12,fontWeight:800,color:isMe?PURPLE:T.dark}}>@{(name||"user").split(" ")[0]}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:3}}>
        <DagLogo size={9}/>
        <span style={{fontSize:12,fontWeight:900,color:isTop?T.primary:T.dark}}>{value}</span>
      </div>
    </div>
  );
}

/* ── Winner row (3-column: name | wins | total) ────────── */
function WinnerRow({rank,name,wins,total,isMe,S,BG,T,PURPLE}){
  const init=(name||"?").split(" ").map(w=>w[0]).join("").substring(0,2).toUpperCase();
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 32px 56px",alignItems:"center",gap:4,padding:"5px 4px",borderRadius:10,
      background:rank===1?BG:"transparent",boxShadow:rank===1?S.concave:"none",border:rank===1?"1px solid rgba(255,255,255,0.6)":"none"}}>
      {/* Name */}
      <div style={{display:"flex",alignItems:"center",gap:5,minWidth:0}}>
        <span style={{fontSize:10,fontWeight:800,width:14,color:rank===1?T.primary:T.muted,textAlign:"center",flexShrink:0}}>{rank}</span>
        <div style={{width:22,height:22,borderRadius:"50%",background:BG,boxShadow:rank===1?S.convex:S.concave,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:8,fontWeight:800,color:isMe?PURPLE:T.muted}}>{init}</span>
        </div>
        <span style={{fontSize:11,fontWeight:800,color:isMe?PURPLE:T.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>@{(name||"user").split(" ")[0]}</span>
      </div>
      {/* Wins */}
      <span style={{fontSize:11,fontWeight:900,color:PURPLE,textAlign:"center"}}>{wins}w</span>
      {/* Total */}
      <div style={{display:"flex",alignItems:"center",gap:2,justifyContent:"flex-end"}}>
        <DagLogo size={9}/>
        <span style={{fontSize:11,fontWeight:900,color:rank===1?T.primary:T.dark}}>{total}</span>
      </div>
    </div>
  );
}

/* ── Chat bubble ─────────────────────────────────────────── */
function ChatBubble({msg,S,BG,T,PURPLE}){
  if(msg.type==="system") return(
    <div style={{background:BG,boxShadow:S.concave,borderRadius:10,padding:"6px 9px",display:"flex",alignItems:"flex-start",gap:5,border:"1px solid rgba(255,255,255,0.5)",flexShrink:0}}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" style={{flexShrink:0,marginTop:1}}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <p style={{margin:0,fontSize:11,fontWeight:600,color:T.dark,lineHeight:1.4}}>{msg.text}</p>
    </div>
  );
  return(
    <div style={{background:BG,boxShadow:"5px 5px 12px rgba(163,177,198,0.5),-5px -5px 12px rgba(255,255,255,0.88)",borderRadius:"3px 13px 13px 13px",padding:"8px 10px",maxWidth:"94%",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}>
        <div style={{width:14,height:14,borderRadius:"50%",background:BG,boxShadow:S.concave,flexShrink:0}}/>
        <span style={{fontSize:10,fontWeight:900,color:PURPLE}}>{msg.user}</span>
      </div>
      <p style={{margin:0,fontSize:12,fontWeight:600,color:T.dark,lineHeight:1.4}}>{msg.text}</p>
    </div>
  );
}
